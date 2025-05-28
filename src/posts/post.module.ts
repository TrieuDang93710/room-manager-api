/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from '../user/entities/user.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { RequireEntity } from '../requires/entities/require.entity';
import { RatingEntity } from '../rating/entities/rating.entity';
import { ManagerEntity } from '../user/entities/manager.entity';
import { ApplicantEntity } from '../user/entities/applicant.entity';
import { WorkPlaceEntity } from '../work_place/entities/work-place.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { ApplyEntity } from '../apply/entities/apply.entity';
import { ResumeEntity } from '../resume/entities/resume.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      PostEntity,
      UserEntity,
      ManagerEntity,
      ApplicantEntity,
      CategoryEntity,
      RequireEntity,
      RatingEntity,
      WorkPlaceEntity,
      CompanyEntity,
      ApplyEntity,
      ResumeEntity
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
