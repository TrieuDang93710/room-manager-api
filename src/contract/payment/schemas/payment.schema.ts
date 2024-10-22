/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: false
})
export class Payment {
    @Prop()
    payBy: string

    @Prop()
    method: string
}

export const PaymentSchema = SchemaFactory.createForClass(Payment)