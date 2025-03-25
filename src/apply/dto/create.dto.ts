/* eslint-disable prettier/prettier */

import { IsOptional } from 'class-validator';

export class CreateApplyDto {
  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly letter: object;

  @IsOptional()
  readonly post: number;

  @IsOptional()
  readonly resume: number;
}
