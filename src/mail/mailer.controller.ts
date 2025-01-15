/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('activation')
export class MailController {
  constructor(private readonly mailerService: MailerService) {}

  @Get('/mail')
  async testMail() {
    this.mailerService
      .sendMail({
        to: 'dangbinhtrieu123@gmail.com',
        from: 'trieu93710@donga.edu.vn', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {})
      .catch(() => {});
    return 'OK';
  }
}
