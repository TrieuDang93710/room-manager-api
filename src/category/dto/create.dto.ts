/* eslint-disable prettier/prettier */

import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsOptional()
  readonly fieldId: number
}
