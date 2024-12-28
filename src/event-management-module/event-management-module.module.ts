import { Module } from '@nestjs/common';
import { EventManagementModuleService } from './event-management-module.service';
import { EventManagementModuleController } from './event-management-module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTable } from './entities/event-table.entity';
import { AttendeeTable } from './entities/attendee-table.entity';
import { RegistrationTable } from './entities/registration-table.entity';
import { EventManagementService } from './event-management.service';
import { AttendeeManagementService } from './attendee-management.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTable]),
    TypeOrmModule.forFeature([AttendeeTable]),
    TypeOrmModule.forFeature([RegistrationTable])
  ],
  controllers: [EventManagementModuleController],
  providers: [EventManagementModuleService, EventManagementService, AttendeeManagementService],
})
export class EventManagementModuleModule {}
