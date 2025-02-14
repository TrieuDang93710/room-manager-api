/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateContractDto {
  @IsNotEmpty()
  @IsString()
  apply: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  applicant: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  post: number;
}
