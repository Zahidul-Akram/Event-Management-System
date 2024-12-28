import { Module } from '@nestjs/common';
import { EventManagementModuleController } from './event-management-module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventTable } from './entities/event-table.entity';
import { AttendeeTable } from './entities/attendee-table.entity';
import { RegistrationTable } from './entities/registration-table.entity';
import { EventManagementService } from './event-management.service';
import { AttendeeManagementService } from './attendee-management.service';
import { RegistrationManagementService } from './registration-management.service';
import { BullModule } from '@nestjs/bull';
import { EmailController } from './email.controller';
import { Scheduler } from './scheduler';
import { NotificationsGateway } from './notification';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventTable]),
    TypeOrmModule.forFeature([AttendeeTable]),
    TypeOrmModule.forFeature([RegistrationTable]),
    BullModule.registerQueue({
      name: 'emailQueue',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [EventManagementModuleController, EmailController, Scheduler],
  providers: [EventManagementService, AttendeeManagementService, RegistrationManagementService, NotificationsGateway],
})
export class EventManagementModuleModule {}
