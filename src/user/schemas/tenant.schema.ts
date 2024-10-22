/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({
    timestamps: true
})
export class Tenant {

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Room', }])
    saves: []

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Lessor', }])
    followers: []

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }])
    wishlists: []

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: string

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }])
    historys: []

}

export const TenantSchema = SchemaFactory.createForClass(Tenant)