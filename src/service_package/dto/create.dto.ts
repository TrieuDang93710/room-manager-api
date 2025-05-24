/* eslint-disable prettier/prettier */

import { IsNumber, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  description: string;

  @IsString()
  note: string;

  @IsNumber()
  price: number;

  @IsNumber()
  news_quantity: number;
}
