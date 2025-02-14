/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WorkPlaceService } from './work_place.service';
import { WorkPlaceController } from './work_place.controller';
import { PostEntity } from 'src/posts/entities/post.entity';
import { WorkPlaceEntity } from './entities/work-place.entity';

@Module({
  imports: [PostEntity, WorkPlaceEntity],
  providers: [WorkPlaceService],
  controllers: [WorkPlaceController],
})
export class WorkPlaceModule {}
