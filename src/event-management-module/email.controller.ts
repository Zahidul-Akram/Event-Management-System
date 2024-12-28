import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventManagementService } from './event-management.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AttendeeManagementService } from './attendee-management.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RegistrationManagementService } from './registration-management.service';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { Process } from '@nestjs/bull';
import { Job } from 'bull';

@Controller('emailQueue')
export class EmailController {
  constructor(
    private readonly registrationManagementService: RegistrationManagementService,
    private readonly eventManagementService: EventManagementService
  ) {}

  @Process('sendConfirmationEmail')
  async sendEmail(job: Job) {
    const { attendeeEmail, eventName } = job.data;
    console.log(`Processing email for ${attendeeEmail} and event ${eventName}`);

    await this.registrationManagementService.sendConfirmationEmail(attendeeEmail, eventName);
  }

  @Process('sendEventReminderEmail')
  async sendReminderEmail(job: Job) {
    const { attendeeEmail } = job.data;
    console.log(`Processing email for ${attendeeEmail}`);

    await this.eventManagementService.sendEventReminderEmail(attendeeEmail);
  }
}
