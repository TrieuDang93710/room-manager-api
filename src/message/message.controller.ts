/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { SendDto } from './dto/send.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:userToChatId')
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER, Role.MANAGER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getMessages(
    @Param('userToChatId')
    userToChatId: number,
    @Req()
    req: any,
  ) {
    return this.messageService.getMessages(userToChatId, req.user.id);
  }

  @Post('/send/:receiverId')
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER, Role.MANAGER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async sendMessage(
    @Body()
    sendDto: SendDto,
    @Param('receiverId')
    receiverId: number,
    @Req()
    req: any,
  ) {
    return this.messageService.sendMessage(sendDto, receiverId, req.user);
  }
}
