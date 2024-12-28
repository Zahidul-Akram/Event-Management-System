import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventTable } from "./entities/event-table.entity";
import { Not, Repository } from "typeorm";
import { AttendeeTable } from "./entities/attendee-table.entity";
import { RegistrationTable } from "./entities/registration-table.entity";
import { CreateEventDto } from "./dto/create-event.dto";
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UpdateEventDto } from "./dto/update-event.dto";
import { CreateAttendeeDto } from "./dto/create-attendee.dto";
import { RegisterAttendeeDto } from "./dto/register-attendee.dto";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import * as nodemailer from 'nodemailer';



@Injectable()
export class RegistrationManagementService {

  constructor(
    @InjectRepository(EventTable)
    private readonly eventTableRepository: Repository<EventTable>,
    @InjectRepository(AttendeeTable)
    private readonly attendeeTableRepository: Repository<AttendeeTable>,
    @InjectRepository(RegistrationTable)
    private readonly registrationTableRepository: Repository<RegistrationTable>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectQueue('emailQueue') private emailQueue: Queue
  ) { }

  async registerAttendee(registerAttendeeDto: RegisterAttendeeDto) {
    const [existingRegistration, eventDetails, attendeeDetails, existingEventAttendees] = await Promise.all([
      this.registrationTableRepository.findOne({
        where: {
          event: { id: registerAttendeeDto.event_id },
          attendee: { id: registerAttendeeDto.attendee_id }  
        }
      }),
      this.eventTableRepository.findOne({where:{
        id: registerAttendeeDto.event_id
      }}),
      this.attendeeTableRepository.findOne({
        where: {
          id: registerAttendeeDto.attendee_id
        }
      }),
      this.registrationTableRepository.count({
        where: {
          event: { id: registerAttendeeDto.event_id }
        }
      }),
    ]);
  
    if (existingRegistration) {
      return { statusCode: 200, message: 'Registration already exists!' };
    }
  
    if (!eventDetails || !attendeeDetails) {
      return { statusCode: 400, message: 'Wrong credential!' };
    }
  
    if (existingEventAttendees >= eventDetails.max_attendees) {
      return { statusCode: 400, message: 'The event registration is full!' };
    }
  
    const registrationTable: RegistrationTable = new RegistrationTable();
    registrationTable.event = eventDetails;
    registrationTable.attendee = attendeeDetails;
  
    try {
      const newRegistration =  await this.registrationTableRepository.save(registrationTable);

      await this.addEmailJob(attendeeDetails.email, eventDetails.name);

      return newRegistration;
    } catch (error) {
      throw new HttpException(
        'Failed to register an attendee!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listEventRegistrations(eventId: string) {
    const cacheKey = `event_registrations${`_${eventId}`}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit: ', cachedData);
      return cachedData;
    }

    const [registrations , counts] = await this.registrationTableRepository
      .createQueryBuilder('registration') 
      .leftJoinAndSelect('registration.attendee', 'attendee')
      .where('registration.event.id = :eventId', { eventId })
      .getManyAndCount();
  
    if (!registrations.length) {
      return { statusCode: 404, message: 'No registrations found for this event.' };
    }

    const res =  {
      total: counts,
      data: registrations,
    };

    await this.cacheManager.set(cacheKey, res, 6000); 
    return res;
  }

  async sendConfirmationEmail(attendeeEmail: string, eventName: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: attendeeEmail,
      subject: `Registration Confirmation for ${eventName}`,
      text: `Dear Attendee, \n\nYou have successfully registered for the event: ${eventName}. \n\nThank you!`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async addEmailJob(attendeeEmail: string, eventName: string) {
    await this.emailQueue.add('sendConfirmationEmail', { attendeeEmail, eventName });
  }
}