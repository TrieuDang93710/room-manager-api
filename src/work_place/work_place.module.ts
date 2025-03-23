/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WorkPlaceService } from './work_place.service';
import { WorkPlaceController } from './work_place.controller';
import { PostEntity } from 'src/posts/entities/post.entity';
import { WorkPlaceEntity } from './entities/work-place.entity';
import { AddressEntity } from 'src/address/entities/address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, WorkPlaceEntity, AddressEntity]),
  ],
  providers: [WorkPlaceService],
  controllers: [WorkPlaceController],
})
export class WorkPlaceModule {}
