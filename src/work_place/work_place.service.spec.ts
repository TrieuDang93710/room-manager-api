/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkPlaceService } from './work_place.service';

describe('WorkPlaceService', () => {
  let service: WorkPlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkPlaceService],
    }).compile();

    service = module.get<WorkPlaceService>(WorkPlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
