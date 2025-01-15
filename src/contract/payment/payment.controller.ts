/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  async getPayments() {
    return this.paymentService.findAll();
  }
}