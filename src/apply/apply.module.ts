/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApplyController } from './apply.controller';
import { ApplyService } from './apply.service';
import { ApplyEntity } from './entities/apply.entity';
import { ResumeEntity } from 'src/resume/entities/resume.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';

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
