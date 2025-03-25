/* eslint-disable prettier/prettier */

import { IsArray, IsObject, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly logo: string;

  @IsArray()
  readonly contact: [];

  @IsObject()
  readonly work_place: object;
}
