/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Lessor {
  @Prop([
    {
      type: [],
      default: [
        {
          key: '',
          values: '',
        },
      ],
    },
  ])
  social: [];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
}

export const LessorSchema = SchemaFactory.createForClass(Lessor);
