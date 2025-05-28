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
import { ResumeEntity } from '../../resume/entities/resume.entity';
import { CompanyEntity } from '../../company/entities/company.entity';
import { PostEntity } from '../../posts/entities/post.entity';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([]),
    TypeOrmModule.forFeature([
      UserEntity,
      ApplicantEntity,
      ManagerEntity,
      ResumeEntity,
      CompanyEntity,
      PostEntity
    ]),
  ],
  providers: [ApplicantService],
  controllers: [ApplicantController],
})
export class ApplicantModule {}
