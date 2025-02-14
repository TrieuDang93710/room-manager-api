/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from 'src/dto/response.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getMessages(
    id: number,
    user: UserEntity,
  ): Promise<ApiResponseDto<any>> {
    // const userToChatId = await this.userRepository.find({
    //   where: { id: id },
    //   relations: { manager: true },
    // });
    // const messages = await this.messageRepository.find({
    //   where: {},
    // });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all messages success.',
      data: 'messages',
    };
  }
}
