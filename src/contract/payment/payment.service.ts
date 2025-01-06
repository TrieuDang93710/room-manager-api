/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import mongoose from 'mongoose';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: mongoose.Model<Payment>,
  ) {}

  async findAll(): Promise<ApiResponseDto<Payment[]>> {
    const data = await this.paymentModel.find().exec();
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all payment method successfully',
      data: data,
    };
  }
}
