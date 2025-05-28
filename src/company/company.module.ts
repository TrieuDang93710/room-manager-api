/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../posts/entities/post.entity';
import { WorkPlaceEntity } from '../work_place/entities/work-place.entity';
import { CompanyEntity } from './entities/company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './compnay.controller';
import { AddressEntity } from '../address/entities/address.entity';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { ManagerEntity } from '../user/entities/manager.entity';

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
