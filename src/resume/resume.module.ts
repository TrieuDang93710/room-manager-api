/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from './entities/resume.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { ApplicantEntity } from '../user/entities/applicant.entity';
import { ManagerEntity } from '../user/entities/manager.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ResumeEntity,
      UserEntity,
      PostEntity,
      ApplicantEntity,
      ManagerEntity,
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
