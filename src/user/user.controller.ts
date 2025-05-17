/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from '../shared/enums/role.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateUserDto } from './dto/update.dto';
import { DecentralizeDto } from './dto/decentralize.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER, Role.MANAGER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getUsers() {
    return this.userService.findAll();
  }

  @Get('/mail')
  async testMail() {
    this.mailerService.sendMail({
      to: 'dangbinhtrieu123@gmail.com',
      from: 'trieu93710@donga.edu.vn',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      template: 'register',
      context: {
        name: 'dangbinhtrieu',
        activationCode: 123456789,
      },
    });
    return 'OK';
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.TENANT, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getUserById(
    @Param('id')
    id: number,
  ) {
    return this.userService.findById(id);
  }

  @Get('admin/:email')
  // @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAdminByEmail(
    @Param('email')
    email: string,
  ) {
    return this.userService.findAdminByEmail(email);
  }

  @Get('/email/:email')
  // @Roles(Role.ADMIN, Role.USER)
  // @UseGuards(AuthGuard(), RolesGuard)
  async getUserByEmail(
    @Param('email')
    email: string,
  ) {
    return this.userService.findUserByEmail(email);
  }

  @Get('manager/:email')
  // @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getManagerByEmail(
    @Param('email')
    email: string,
  ) {
    return this.userService.findManagerByEmail(email);
  }

  @Patch('admin/decentralize/:id')
  @UseGuards(AuthGuard(), RolesGuard)
  async decentralization(
    @Param('id')
    id: number,
    @Body()
    decentralizeDto: DecentralizeDto,
  ) {
    return this.userService.decentralization(id, decentralizeDto);
  }

  @Patch('update-user')
  @UseGuards(AuthGuard(), RolesGuard)
  async updateUser(
    @Body()
    updateUserDto: UpdateUserDto,
    @Req()
    req: any,
  ) {
    return this.userService.updateUser(updateUserDto, req.user);
  }

  @Delete()
  async remove(@Body() id: number) {
    return this.userService.remove(id);
  }
}
