/* eslint-disable prettier/prettier */

import { IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsOptional()
  email: string;

  @IsOptional()
  amount: string;

  @IsOptional()
  surcharge: number;

  @IsOptional()
  total: string;

  @IsOptional()
  paymentMethod: string[];

  @IsOptional()
  paymentDate: string;

  @IsOptional()
  cardType: string;

  @IsOptional()
  status: string[];

  @IsOptional()
  paymentId: string;
}
