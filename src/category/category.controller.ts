/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ) { }

    @Post()
    async createCategory(
        @Body()
        createCategoryDto: CreateCategoryDto
    ): Promise<Category> {
        return this.categoryService.create(createCategoryDto)
    }

    @Get()
    async getCategories(): Promise<Category[]> {
        return this.categoryService.findAll()
    }
}
