/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RequireController } from './require.controller';
import { RequireService } from './require.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequireEntity } from './entities/require.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ApplicantEntity } from '../user/entities/applicant.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      RequireEntity,
      PostEntity,
      UserEntity,
      ApplicantEntity,
    ]),
  ],
  providers: [RequireService],
  controllers: [RequireController],
})
export class RequireModule {}
