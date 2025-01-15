/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from '../../shared/enums/role.enum';
import { AccountType } from 'src/shared/enums/account-type.enum';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop({ type: Boolean, default: false })
  blocked: boolean;

  @Prop({
    type: [{ type: String, enum: AccountType }],
    default: [AccountType.LOCAL],
  })
  account_type: boolean;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop()
  code_id: string;

  @Prop()
  code_expired: string;

  @Prop({
    type: [{ type: String, enum: Role }],
    default: [Role.USER],
  })
  role: Role[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' })
  tenant: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lessor' })
  lessor: string;

  @Prop()
  token: string;

  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
