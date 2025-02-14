/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
