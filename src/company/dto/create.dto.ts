/* eslint-disable prettier/prettier */

import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly logo: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly images: string;

  @IsOptional()
  readonly scale: string;

  @IsObject()
  readonly information: object;

  @IsObject()
  readonly work_place: object;
}
