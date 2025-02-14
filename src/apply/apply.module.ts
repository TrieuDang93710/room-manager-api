/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ApplyController } from './apply.controller';
import { ApplyService } from './apply.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplyEntity } from './entities/apply.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ApplyEntity,
      UserEntity,
      PostEntity,
      ApplicantEntity,
      ManagerEntity,
    ]),
  ],
  controllers: [ApplyController],
  providers: [ApplyService],
})
export class ApplyModule {}
