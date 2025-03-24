/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { RequireEntity } from 'src/requires/entities/require.entity';
import { RatingEntity } from 'src/rating/entities/rating.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { WorkPlaceEntity } from 'src/work_place/entities/work-place.entity';
import { CompanyEntity } from 'src/company/entities/company.entity';
import { ApplyEntity } from 'src/apply/entities/apply.entity';
import { ResumeEntity } from 'src/resume/entities/resume.entity';

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
