/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please, enter correct email.' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Please, enter password include 6 char.' })
  readonly password: string;
}
