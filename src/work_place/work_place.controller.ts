/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { WorkPlaceService } from './work_place.service';

@Controller('work-place')
export class WorkPlaceController {
  constructor(private workPlaceService: WorkPlaceService) {}

  @Get()
  async getAll() {
    return this.workPlaceService.findAll();
  }
}
