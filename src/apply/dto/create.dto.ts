/* eslint-disable prettier/prettier */

import { IsNumber, IsString } from 'class-validator';

export class CreateApplyDto {
  @IsString()
  readonly description: string;

  @IsNumber()
  readonly post: number;

  @IsNumber()
  readonly resume: number;
}
