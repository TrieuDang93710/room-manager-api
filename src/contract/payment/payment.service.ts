/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose";
import { Payment } from "./schemas/payment.schema";
import mongoose from "mongoose";

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name)
        private paymentModel: mongoose.Model<Payment>
    ) { }

    async findAll(): Promise<Payment[]> {
        return this.paymentModel.find().exec()
    }
}