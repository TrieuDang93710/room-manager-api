/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address } from './schemas/address.schema';
import mongoose from 'mongoose';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name)
    private addressModel: mongoose.Model<Address>,
  ) {}

  async findAll(): Promise<ApiResponseDto<Address[]>> {
    const data = await this.addressModel.find();
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all address successfully',
      data: data,
    };
  }
}
