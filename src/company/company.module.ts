/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { WorkPlaceEntity } from 'src/work_place/entities/work-place.entity';
import { CompanyEntity } from './entities/company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './compnay.controller';
import { AddressEntity } from 'src/address/entities/address.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      CompanyEntity,
      PostEntity,
      WorkPlaceEntity,
      AddressEntity,
      UserEntity,
      ManagerEntity
    ]),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
