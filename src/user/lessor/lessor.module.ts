/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { LessorController } from './lessor.controller';
import { UserModule } from '../user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ApplicantEntity } from '../entities/applicant.entity';
import { ManagerEntity } from '../entities/manager.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity, ApplicantEntity, ManagerEntity]),
  ],
  providers: [LessorService],
  controllers: [LessorController],
})
export class LessorModule {}
