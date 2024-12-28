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
// import Redis from 'ioredis';
// import * as cacheManager from 'cache-manager';
// import * as redisStore from 'cache-manager-ioredis';

// const redisClient = new Redis();
// const cache = cacheManager.caching({
//   store: redisStore,
//   host: 'localhost', // Redis host, change if necessary
//   port: 6379, // Redis port, change if necessary
//   ttl: 60, // Time-to-live in seconds for cache
// });

@Injectable()
export class EventManagementService {

  constructor(
    @InjectRepository(EventTable)
    private readonly eventTableRepository: Repository<EventTable>,
    @InjectRepository(AttendeeTable)
    private readonly attendeeTableRepository: Repository<AttendeeTable>,
    @InjectRepository(RegistrationTable)
    private readonly registrationTableRepository: Repository<RegistrationTable>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async createEvent(createEventDto: CreateEventDto) {
    if (createEventDto.max_attendees < 0) {
      throw new HttpException(
        'Max attendees can not be negative!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingEvent = await this.eventTableRepository.findOne({
      where: {
        date: new Date(createEventDto.date)
      }
    });

    if (existingEvent) {
      return { statusCode: 200, message: 'An event is already happening that day!' };
    }

    const newEvent: EventTable = new EventTable();
    newEvent.name = createEventDto.name;
    newEvent.description = createEventDto.description || '';
    newEvent.date = new Date(createEventDto.date);
    newEvent.location = createEventDto.location || '';
    newEvent.max_attendees = createEventDto.max_attendees;

    try{
      return await this.eventTableRepository.save(newEvent);
    }catch{
      throw new HttpException(
        'Failed to create a new event!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllEvents(date?: string) {
    const cacheKey = `all_events${date ? `_${date.toLowerCase()}` : ''}`;
    const cachedData = await this.cacheManager.get(cacheKey);
    
    if (cachedData) {
      console.log('Cache hit: ', cachedData);
      return cachedData;
    }

    const allEvents = await this.eventTableRepository.query(
      `
      SELECT
        e.*
      FROM
        "event_table" e
      ${
        date
          ? `
          WHERE
            DATE(e."date") = DATE($1)
          `
          : ''
      }
      `,
      date ? [date] : []
    );

    await this.cacheManager.set(cacheKey, allEvents, 6000); 
  
    return allEvents;
  }

  async getOneEventDetails(id: string) {
    const cachedData = await this.cacheManager.get(`event_details_${id}`);
    if (cachedData) {
      return cachedData;
    }
    const eventDetails = await this.eventTableRepository.findOne({
      where: {
        id,
      },
    });

    if (eventDetails) {
      await this.cacheManager.set(`event_details_${id}`, eventDetails, 6000);
    } else {
      return {statusCode: 200, message: 'No event found with this id!'};
    }

    return eventDetails;
  }

  async updateEventDetails(id: string, updateEventDto: UpdateEventDto){
    const eventDetails = await this.eventTableRepository.findOne({
      where: {
        id
      },
    });

    if(!eventDetails){
      return {statusCode: 200, message: 'No event found with this id!'};
    }

    if(updateEventDto.date){
      const existingEvent = await this.eventTableRepository.findOne({
        where: {
          id: Not(id),
          date: new Date(updateEventDto.date)
        }
      });
  
      if (existingEvent) {
        return { statusCode: 200, message: 'An event is already happening that day!' };
      }
    }

    eventDetails.name = updateEventDto.name || eventDetails.name;
    eventDetails.description = updateEventDto.description || eventDetails.description;
    eventDetails.date = updateEventDto.date ? new Date(updateEventDto.date) : eventDetails.date;
    eventDetails.location = updateEventDto.location || eventDetails.location;
    eventDetails.max_attendees = updateEventDto.max_attendees  || eventDetails.max_attendees;

    try{
      return await this.eventTableRepository.save(eventDetails);
    }catch{
      throw new HttpException(
        'Failed to update an event!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteEvent(id: string){
    const eventDetails = await this.eventTableRepository.findOne({
      where: {
        id,
      },
    });

    if(!eventDetails){
      return {statusCode: 200, message: 'No event found with this id!'};
    }

    try{
      return await this.eventTableRepository.delete(eventDetails.id)
    }catch{
      throw new HttpException(
        'Failed to delete a new event!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}