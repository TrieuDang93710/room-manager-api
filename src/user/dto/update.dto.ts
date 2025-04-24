/* eslint-disable prettier/prettier */

import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  readonly avatar: string;

  @IsString()
  readonly date_of_birth: Date;

  @IsString()
  readonly phone: string;

  @IsOptional()
  readonly gender: string[];

  @IsOptional()
  readonly skill: object;

  @IsOptional()
  readonly language: object;

  @IsOptional()
  readonly hobby: object;

  @IsOptional()
  readonly address: number;
}
