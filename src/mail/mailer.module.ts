/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MailController } from './mailer.controller';
import { MailService } from './mailer.service';

@Module({
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
