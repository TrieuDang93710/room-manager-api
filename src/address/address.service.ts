/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './schemas/address.schema';
import mongoose from 'mongoose';

@Injectable()
export class AddressService {
    constructor(
        @InjectModel(Address.name)
        private addressModel: mongoose.Model<Address>
    ) { }

    async findAll(): Promise<Address[]> {
        return this.addressModel.find()
    }
}
