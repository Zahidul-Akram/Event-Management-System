import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventManagementModuleService } from './event-management-module.service';
import { CreateEventManagementModuleDto } from './dto/create-event-management-module.dto';
import { UpdateEventManagementModuleDto } from './dto/update-event-management-module.dto';

@Controller('event-management-module')
export class EventManagementModuleController {
  constructor(private readonly eventManagementModuleService: EventManagementModuleService) {}

  @Post()
  create(@Body() createEventManagementModuleDto: CreateEventManagementModuleDto) {
    return this.eventManagementModuleService.create(createEventManagementModuleDto);
  }

  @Get()
  findAll() {
    return this.eventManagementModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventManagementModuleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventManagementModuleDto: UpdateEventManagementModuleDto) {
    return this.eventManagementModuleService.update(+id, updateEventManagementModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventManagementModuleService.remove(+id);
  }
}
