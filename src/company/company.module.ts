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

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      CompanyEntity,
      PostEntity,
      WorkPlaceEntity,
      AddressEntity,
    ]),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
