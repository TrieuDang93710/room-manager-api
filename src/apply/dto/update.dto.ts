/* eslint-disable prettier/prettier */

import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  @IsEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsEmpty()
  @IsString()
  contract: string;

  @IsOptional()
  @IsEmpty()
  contractStart: Date;

  @IsOptional()
  @IsEmpty()
  contractTerm: Date;

  @IsOptional()
  @IsEmpty()
  @IsNumber()
  people: number;

  @IsOptional()
  @IsEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmpty()
  @IsNumber()
  deposit: number;

  @IsOptional()
  @IsEmpty()
  @IsNumber()
  payments: number;

  @IsOptional()
  @IsEmpty()
  @IsNumber()
  tenant: number;

  @IsOptional()
  @IsEmpty()
  @IsNumber()
  room: number;

  @IsOptional()
  @IsEmpty()
  @IsNumber()
  createBy: number;
}
