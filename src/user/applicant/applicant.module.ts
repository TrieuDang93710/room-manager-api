/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicantController } from './applicant.controller';
import { UserModule } from '../user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ApplicantEntity } from '../entities/applicant.entity';
import { ManagerEntity } from '../entities/manager.entity';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
    ]),
    TypeOrmModule.forFeature([UserEntity, ApplicantEntity, ManagerEntity]),
  ],
  providers: [ApplicantService],
  controllers: [ApplicantController],
})
export class ApplicantModule {}
