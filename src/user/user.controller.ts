/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from '../shared/enums/role.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('/signup')
  async signUp(
    @Body()
    signUpDto: SignUpDto,
  ) {
    return this.userService.signup(signUpDto);
  }

  @Post('/activate-account/:userId')
  @Roles(Role.ADMIN, Role.LESSOR, Role.TENANT)
  async activateAccount(@Param('userId') userId: string) {
    return this.userService.activateAccount(userId);
  }

  @Post('/login')
  async login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.userService.login(loginDto);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required.');
    }
    return this.userService.verifyRefreshToken(refreshToken);
  }

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async getUsers() {
    return this.userService.findAll();
  }

  @Get('/mail')
  async testMail() {
    this.mailerService
      .sendMail({
        to: 'dangbinhtrieu123@gmail.com',
        from: 'trieu93710@donga.edu.vn', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        // html: '<b>welcome</b>', // HTML body content
        template: 'register',
        context: {
          name: 'dangbinhtrieu',
          activationCode: 123456789,
        },
      })
      .then(() => {})
      .catch(() => {});
    return 'OK';
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.LESSOR, Role.TENANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getUserById(
    @Param('id')
    id: string,
  ) {
    return this.userService.findById(id);
  }
}
