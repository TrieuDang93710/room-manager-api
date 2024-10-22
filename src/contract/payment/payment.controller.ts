/* eslint-disable prettier/prettier */
import { Controller, Get } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Payment } from "./schemas/payment.schema";
@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService
    ) { }

    @Get()
    async getPayments(): Promise<Payment[]> {
        return this.paymentService.findAll()
    }
}