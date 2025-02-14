/* eslint-disable prettier/prettier */

import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod, PaymentType } from 'src/shared/enums/payment.enum';

export class CreatePaymentDto {
  @IsOptional()
  paymentDate: string;

  @IsOptional()
  @IsArray()
  @IsEnum(PaymentMethod, { each: true })
  paymentMethod: PaymentMethod[];
  
  @IsOptional()
  @IsArray()
  @IsEnum(PaymentType, { each: true })
  paymentType: PaymentType[];

  @IsOptional()
  amount: number;

  @IsOptional()
  surcharge: number;

  @IsOptional()
  servicePackageEntity: number;
}
