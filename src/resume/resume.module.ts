/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from './entities/resume.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';

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
