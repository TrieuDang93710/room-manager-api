/* eslint-disable prettier/prettier */
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from '../dto/response.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getMessages(
    userToChatId: number,
    myId: number,
  ): Promise<ApiResponseDto<any>> {
    const data: any = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.receiver', 'receiver')
      .addSelect([
        'sender.id',
        'sender.username',
        'sender.email',
        'sender.role',
        'receiver.id',
        'receiver.username',
        'receiver.email',
        'receiver.role',
      ])
      .where(
        'message.sender.id = :myId AND message.receiver.id = :userToChatId',
        { myId, userToChatId },
      )
      .orWhere(
        'message.sender.id = :userToChatId AND message.receiver.id = :myId',
        { myId, userToChatId },
      )
      .getMany();

    return {
      statusCode: HttpStatus.OK,
      message: 'Get all messages success.',
      data: data,
    };
  }

  async sendMessage(
    sendDto: any,
    receiverId: number,
    sender: UserEntity,
  ): Promise<ApiResponseDto<any>> {
    if (!sendDto) {
      throw new BadRequestException('Not found message body');
    }
    const { text, image } = sendDto;

    const userToChat: UserEntity = await this.userRepository.findOne({
      where: { id: receiverId },
      relations: { receiverMessages: true, senderMessages: true },
    });

    const findSender: UserEntity = await this.userRepository.findOne({
      where: { id: sender.id },
      relations: { receiverMessages: true, senderMessages: true },
    });

    const newMessage = this.messageRepository.create({
      sender: sender,
      receiver: userToChat,
      text: text,
      image: image,
    });

    await this.messageRepository.save(newMessage);

    if (!findSender.senderMessages) {
      findSender.senderMessages = [newMessage];
    } else {
      const senderMessagesExisted = findSender.senderMessages.some(
        (ct) => ct.id === newMessage.id,
      );
      if (!senderMessagesExisted) {
        findSender.senderMessages = [...findSender.senderMessages, newMessage];
      }
    }

    if (!userToChat.receiverMessages) {
      userToChat.receiverMessages = [newMessage];
    } else {
      const receiverMessagesExisted = userToChat.receiverMessages.some(
        (ct) => ct.id === newMessage.id,
      );
      if (!receiverMessagesExisted) {
        userToChat.receiverMessages = [
          ...userToChat.receiverMessages,
          newMessage,
        ];
      }
    }

    // Save the updated sender and receiver user entities
    await this.userRepository.save(findSender);
    await this.userRepository.save(userToChat);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new messages success.',
      data: newMessage,
    };
  }
}
