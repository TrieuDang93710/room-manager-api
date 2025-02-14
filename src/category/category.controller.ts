/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async getCategories(
    @Query()
    query: ExpressQuery,
  ) {
    return this.categoryService.findAll(query);
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: number) {
    return this.categoryService.findById(id);
  }

  @Patch('/:id')
  async updateCategoryById(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateById(id, updateCategoryDto);
  }

  @Delete('/:id')
  async deleteCategoryById(@Param('id') id: number) {
    return this.categoryService.deleteById(id);
  }
}
