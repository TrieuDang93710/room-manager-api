/* eslint-disable prettier/prettier */

import { IsArray, IsObject, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  readonly title: string;

  @IsArray()
  readonly contact: [];

  @IsObject()
  readonly work_place: object;
}
