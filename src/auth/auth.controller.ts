/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { ForgotPasswordDto } from 'src/user/dto/forgot.dto';
import { SignInDto } from 'src/user/dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async signUp(
    @Body()
    signUpDto: any,
  ) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/activate-account/:userId')
  @Roles(Role.ADMIN, Role.LESSOR, Role.TENANT, Role.APPLICANT)
  async activateAccount(
    @Param('userId') userId: number,
    @Body() codeId: string,
  ) {
    return this.authService.activateAccount(userId, codeId);
  }

  @Post('/sign-in')
  async login(
    @Body()
    signInDto: SignInDto,
  ) {
    return this.authService.signIn(signInDto);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshToken: string) {
    // if (!refreshToken) {
    //   throw new BadRequestException('Refresh token is required.');
    // }
    return this.authService.verifyRefreshToken(refreshToken);
  }

  @Patch('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }
}
