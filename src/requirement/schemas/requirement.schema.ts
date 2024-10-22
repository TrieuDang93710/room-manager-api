/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps: false
})
export class Requirement {

    @Prop({ type: Boolean, default: false })
    status: boolean

    @Prop()
    description: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
    roomId: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createBy: string

}

export const RequirementSchema = SchemaFactory.createForClass(Requirement)