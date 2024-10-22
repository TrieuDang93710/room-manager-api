/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({
    timestamps: true
})
export class Room {

    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    address: string

    @Prop()
    price: string

    @Prop({ type: Boolean, default: false })
    status: false

    @Prop()
    numOfRoom: string

    @Prop({ type: Array, default: [] })
    images: Array<string>

    @Prop()
    video: string

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }])
    rentPerRoom: []

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
    typeOfRoom: string

    @Prop({ type: Boolean, default: false })
    hidden: false

    @Prop({ type: Boolean, default: false })
    approved: false

    @Prop({ type: Boolean, default: false })
    removed: false

    @Prop([{
        star: Number,
        comment: String,
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }])
    ratings: [{
        star: 0,
        comment: '',
        postId: string
    }]

    @Prop()
    totalRating: number

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Requirement' }])
    requires: []

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createBy: string
}

export const RoomSchema = SchemaFactory.createForClass(Room)