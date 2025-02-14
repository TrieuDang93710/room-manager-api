/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RequireController } from './require.controller';
import { RequireService } from './require.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequireEntity } from './entities/require.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';

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
