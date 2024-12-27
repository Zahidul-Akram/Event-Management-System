import { Injectable } from '@nestjs/common';
import { CreateEventManagementModuleDto } from './dto/create-event-management-module.dto';
import { UpdateEventManagementModuleDto } from './dto/update-event-management-module.dto';

@Injectable()
export class EventManagementModuleService {
  create(createEventManagementModuleDto: CreateEventManagementModuleDto) {
    return 'This action adds a new eventManagementModule';
  }

  findAll() {
    return `This action returns all eventManagementModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventManagementModule`;
  }

  update(id: number, updateEventManagementModuleDto: UpdateEventManagementModuleDto) {
    return `This action updates a #${id} eventManagementModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventManagementModule`;
  }
}
