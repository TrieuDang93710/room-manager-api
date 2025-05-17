/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './entities/news.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([NewsEntity])],
  providers: [NewsService],
  controllers: [NewsController],
})
export class NewsModule {}
