import { Injectable } from '@nestjs/common';

@Injectable()
export class EventManagementModuleService {

  constructor(
  ){}

  findAll() {
    return `This action returns all eventManagementModule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventManagementModule`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventManagementModule`;
  }
}
