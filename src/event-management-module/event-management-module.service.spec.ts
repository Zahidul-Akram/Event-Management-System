import { Test, TestingModule } from '@nestjs/testing';
import { EventManagementModuleService } from './event-management-module.service';

describe('EventManagementModuleService', () => {
  let service: EventManagementModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventManagementModuleService],
    }).compile();

    service = module.get<EventManagementModuleService>(EventManagementModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
