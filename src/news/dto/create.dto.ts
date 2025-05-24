/* eslint-disable prettier/prettier */

import { IsArray, IsObject, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsArray()
  image: string[];

  @IsString()
  banner: string;

  @IsString()
  title: string;

  @IsString()
  contents: string;

  @IsObject()
  information: object;
}
