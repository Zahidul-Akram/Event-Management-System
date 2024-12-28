import { Controller } from "@nestjs/common";
import { EventManagementService } from "./event-management.service";
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('Scheduler')
export class Scheduler {
    constructor(
        private readonly eventManagementService: EventManagementService
    ) { }


    @Cron(CronExpression.EVERY_5_MINUTES)
    async eventReminderScheduler() {
        console.log("Event Reminding...")
        await this.eventManagementService.eventReminder();
    }
}