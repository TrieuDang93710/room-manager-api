/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
    timestamps: true
})
export class Lessor {
    @Prop([{
        type: [], default: [{
            key: '',
            values: ''
        }]
    }])
    social: []
}

export const LessorSchema = SchemaFactory.createForClass(Lessor)