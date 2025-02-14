/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkPlaceController } from './work_place.controller';

describe('WorkPlaceController', () => {
  let controller: WorkPlaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkPlaceController],
    }).compile();

    controller = module.get<WorkPlaceController>(WorkPlaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
