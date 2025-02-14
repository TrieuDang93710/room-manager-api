/* eslint-disable prettier/prettier */

import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly slug: string;

  @IsString()
  readonly description: string;
}
