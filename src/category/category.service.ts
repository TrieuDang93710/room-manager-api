/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: Like(`%${query.keyword}%`),
        }
      : {};

    const [result, total] = await this.categoryRepository.findAndCount({
      where: keyword,
      relations: {
        posts: true,
      },
      select: {
        posts: {
          title: true,
          description: true,
          status: true,
        },
      },
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);
    // const data = await this.categoryRepository.find({
    //   relations: { rooms: true },
    // });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all category successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async findById(id: number): Promise<ApiResponseDto<CategoryEntity>> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
      relations: { posts: true },
    });
    if (!category) {
      throw new NotFoundException('Not found category by id');
    }
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get category information by id successfully',
      data: category,
    };
  }

  async create(
    category: CreateCategoryDto,
  ): Promise<ApiResponseDto<CategoryEntity>> {
    const data = this.categoryRepository.create(category);
    await this.categoryRepository.save(data);
    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Create new category successfully',
      data: data,
    };
  }

  async updateById(
    id: number,
    updateDto: UpdateCategoryDto,
  ): Promise<ApiResponseDto<CategoryEntity>> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) {
      throw new NotFoundException('Not found category by id');
    }
    const updateCategory: any = await this.categoryRepository.update(id, {
      title: updateDto.title,
      description: updateDto.description,
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Update category by id successfully',
      data: updateCategory,
    };
  }

  async deleteById(id: number): Promise<ApiResponseDto<CategoryEntity>> {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) {
      throw new NotFoundException('Not found category by id');
    }
    await this.categoryRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Delete category by id successfully',
      data: category,
    };
  }
}
