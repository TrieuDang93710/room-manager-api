/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentSchema } from "./schemas/payment.schema";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payment', schema: PaymentSchema }
    ])
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule { }