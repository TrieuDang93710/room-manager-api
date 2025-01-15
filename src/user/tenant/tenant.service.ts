/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant } from '../schemas/tenant.schema';
import mongoose from 'mongoose';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name)
    private tenantModel: mongoose.Model<Tenant>,
  ) {}

  async findAll(): Promise<ApiResponseDto<Tenant[]>> {
    const data = await this.tenantModel
      .find()
      // .populate('historys')
      .populate('userId')
      // .populate('saves')
      // .populate('followers')
      // .populate('wishlists')
      .exec();
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all tenant successfully',
      data: data,
    };
  }
}
