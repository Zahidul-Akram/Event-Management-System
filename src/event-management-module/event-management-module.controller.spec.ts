import { Test, TestingModule } from '@nestjs/testing';
import { EventManagementModuleController } from './event-management-module.controller';
import { EventManagementService } from './event-management.service';

describe('EventManagementModuleController', () => {
  let controller: EventManagementModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventManagementModuleController],
      providers: [EventManagementService],
    }).compile();

    controller = module.get<EventManagementModuleController>(EventManagementModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
