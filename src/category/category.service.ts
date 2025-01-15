/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import mongoose from 'mongoose';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: mongoose.Model<Category>,
  ) {}

  async findAll(): Promise<ApiResponseDto<Category[]>> {
    const data = await this.categoryModel.find().populate('rooms').exec();
    return {
      statusCode: 201,
      statusMessage: 'Get all category successfully',
      data: data,
    };
  }

  async create(category: Category): Promise<ApiResponseDto<Category>> {
    const data = await this.categoryModel.create(category);
    return {
      statusCode: 201,
      statusMessage: 'Create new category successfully',
      data: data,
    };
  }
}
