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


@Injectable()
export class AttendeeManagementService {

  constructor(
    @InjectRepository(EventTable)
    private readonly eventTableRepository: Repository<EventTable>,
    @InjectRepository(AttendeeTable)
    private readonly attendeeTableRepository: Repository<AttendeeTable>,
    @InjectRepository(RegistrationTable)
    private readonly registrationTableRepository: Repository<RegistrationTable>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async createAttendee(createAttendeeDto: CreateAttendeeDto) {
    const existingAttendee = await this.attendeeTableRepository.findOne({
      where: {
        email: createAttendeeDto.email
      }
    });

    if (existingAttendee) {
      return { statusCode: 200, message: 'This email already exists!' };
    }

    const attendeeTable: AttendeeTable = new AttendeeTable();
    attendeeTable.name = createAttendeeDto.name;
    attendeeTable.email = createAttendeeDto.email;

    try {
      return await this.attendeeTableRepository.save(attendeeTable);
    } catch {
      throw new HttpException(
        'Failed to add an attendee!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllAttendees(searchWord?: string) {
    const cacheKey = `all_attendees${searchWord ? `_${searchWord.toLowerCase()}` : ''}`;
    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      console.log('Cache hit:', cachedData);
      return cachedData;
    }

    const allAttendees = await this.eventTableRepository.query(`
      SELECT
        a.*
      FROM
        "attendee-table" a
      ${searchWord
        ? `
          WHERE 
            LOWER(a."name") LIKE '%${searchWord.toLowerCase()}%' OR  
            LOWER(a."email") LIKE '%${searchWord.toLowerCase()}%'
          `
        : ''
      }
    `);

    await this.cacheManager.set(cacheKey, allAttendees, 6000);
    return allAttendees;
  }

  async getOneAttendeeDetails(id: string) {
    const cachedData = await this.cacheManager.get(`attendee_details_${id}`);
    if (cachedData) {
      return cachedData;
    }
    const attendeeDetails = await this.attendeeTableRepository.findOne({
      where: {
        id,
      },
    });

    if (attendeeDetails) {
      await this.cacheManager.set(`attendee_details_${id}`, attendeeDetails, 6000);
    } else {
      return { statusCode: 200, message: 'No event found with this id!' };
    }

    return attendeeDetails;
  }

  async attendeeWithMultipleEvents() {
    const attendees = await this.registrationTableRepository.query(
      `
      SELECT 
        a.*, 
        COUNT(r."event_id") AS "event_count"
      FROM 
        "registration_table" r
      LEFT JOIN 
        "attendee-table" a ON a.id = r.attendee_id
      GROUP BY 
        a.id
      HAVING 
        COUNT(r."event_id") > 1;
      `
    );

    return attendees;
  }
}