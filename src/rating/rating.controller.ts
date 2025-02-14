/* eslint-disable prettier/prettier */

import { Controller, Get } from '@nestjs/common';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  async getAllRatings() {
    return this.ratingService.findAll();
  }
}
