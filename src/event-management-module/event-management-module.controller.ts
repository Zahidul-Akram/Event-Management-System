import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Query } from '@nestjs/common';
import { EventManagementModuleService } from './event-management-module.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventManagementService } from './event-management.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AttendeeManagementService } from './attendee-management.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('event-management-module')
export class EventManagementModuleController {
  constructor(
    private readonly eventManagementService: EventManagementService,
    private readonly attendeeManagementService: AttendeeManagementService
  ) {}

  // Event Management Endpoints
  @Post('createEvent')
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventManagementService.createEvent(createEventDto);
  }

  @Get('getAllEvents')
  @ApiQuery({ name: 'date', required: false, type: String })
  getAllEvents(@Query('date') date: string) {
    return this.eventManagementService.getAllEvents(date || '');
  }

  @Get('getOneEventDetails/:eventId')
  getOneEventDetails(@Param('eventId') eventId: string) {
    return this.eventManagementService.getOneEventDetails(eventId);
  }

  @Patch('updateEventDetails/:eventId')
  updateEventDetails(@Param('eventId') eventId: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventManagementService.updateEventDetails(eventId, updateEventDto);
  }

  @Delete('deleteEvent/:eventId')
  deleteEvent(@Param('eventId') eventId: string) {
    return this.eventManagementService.deleteEvent(eventId);
  }

  // Attendee Management Endpoints
  @Post('createAttendee')
  createAttendee(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeeManagementService.createAttendee(createAttendeeDto);
  }
  
  @Get('getOneAttendeeDetails/:attendeeId')
  getOneAttendeeDetails(@Param('attendeeId') attendeeId: string) {
    return this.attendeeManagementService.getOneAttendeeDetails(attendeeId);
  }

  @Get('getAllAttendees')
  @ApiQuery({ name: 'searchWord', required: false, type: String }) // search with name or email
  getAllAttendees(@Query('searchWord') searchWord: string) {
    return this.attendeeManagementService.getAllAttendees(searchWord || '');
  }
  
}
