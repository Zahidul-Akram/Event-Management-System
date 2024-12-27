import { Test, TestingModule } from '@nestjs/testing';
import { EventManagementModuleController } from './event-management-module.controller';
import { EventManagementModuleService } from './event-management-module.service';

describe('EventManagementModuleController', () => {
  let controller: EventManagementModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventManagementModuleController],
      providers: [EventManagementModuleService],
    }).compile();

    controller = module.get<EventManagementModuleController>(EventManagementModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
