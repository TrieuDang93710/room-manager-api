/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingEntity } from './entities/rating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity])],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
