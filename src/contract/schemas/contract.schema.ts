/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({
    timestamps: true
})
export class Contract {

    @Prop()
    name: string

    @Prop()
    contract: string

    @Prop()
    contractStart: Date

    @Prop()
    contractTerm: Date

    @Prop()
    people: string

    @Prop()
    phone: string

    @Prop()
    deposit: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' })
    pay: string

    @Prop({ type: Boolean, default: false })
    status: boolean

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    tenantBy: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
    roomId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createBy: string
}

export const ContractSchema = SchemaFactory.createForClass(Contract)