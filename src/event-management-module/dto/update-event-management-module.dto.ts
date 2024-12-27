import { PartialType } from '@nestjs/mapped-types';
import { CreateEventManagementModuleDto } from './create-event-management-module.dto';

export class UpdateEventManagementModuleDto extends PartialType(CreateEventManagementModuleDto) {}
