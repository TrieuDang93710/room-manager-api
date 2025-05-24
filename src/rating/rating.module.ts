/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingEntity } from './entities/rating.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RatingEntity])],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
