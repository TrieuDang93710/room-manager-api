/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lessor } from '../schemas/lessor.schema';
import mongoose from 'mongoose';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class LessorService {
  constructor(
    @InjectModel(Lessor.name)
    private lessorModel: mongoose.Model<Lessor>,
  ) {}

  async findAll(): Promise<ApiResponseDto<Lessor[]>> {
    const data = await this.lessorModel.find();
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all lessor successfully',
      data: data,
    };
  }
}