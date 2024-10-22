/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})
export class Address {

    @Prop()
    national: string

    @Prop()
    city: string

    @Prop()
    district: string

    @Prop()
    village: string
}

export const AddressSchema = SchemaFactory.createForClass(Address)