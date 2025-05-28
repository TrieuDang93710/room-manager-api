/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { ApplyController } from './apply.controller';
import { ApplyService } from './apply.service';
import { ApplyEntity } from './entities/apply.entity';
import { ResumeEntity } from '../resume/entities/resume.entity';
import { ApplicantEntity } from '../user/entities/applicant.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ApplyEntity,
      UserEntity,
      PostEntity,
      ResumeEntity,
      ApplicantEntity,
    ]),
  ],
  controllers: [ApplyController],
  providers: [ApplyService],
})
export class ApplyModule {}
