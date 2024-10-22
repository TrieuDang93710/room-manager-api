/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({
    timestamps: true
})
export class Category {

    @Prop()
    name: string

    @Prop()
    slug: string

    @Prop()
    description: string

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }])
    rooms: []

}

export const CategorySchema = SchemaFactory.createForClass(Category)