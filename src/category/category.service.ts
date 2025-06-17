/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { ApiResponseDto } from '../dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create.dto';
import { UpdateCategoryDto } from './dto/update.dto';
import { FieldEntity } from '../field/entities/field.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(FieldEntity)
    private fieldRepository: Repository<FieldEntity>,
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
        field: true,
        posts: true,
      },
      select: {
        posts: {
          id: true,
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
      message: 'Get all category successfully',
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
      message: 'Get category information by id successfully',
      data: category,
    };
  }

  async create(
    category: CreateCategoryDto,
  ): Promise<ApiResponseDto<CategoryEntity>> {
    const findField = await this.fieldRepository.findOne({
      where: { id: Number(category.fieldId) },
    });

    if (!findField) {
      throw new NotFoundException('Not found');
    }

    const data = this.categoryRepository.create({
      title: category.title,
      description: category.description,
      slug: category.title.toLocaleLowerCase().replaceAll(' ', '_'),
      field: findField,
    });

    await this.categoryRepository.save(data);

    if (!findField.cates) {
      findField.cates = [data];
    } else {
      const postAlreadyExisted = findField.cates.some(
        (postIntiCate) => postIntiCate.title === data.title,
      );
      if (postAlreadyExisted === false) {
        findField.cates = [...findField.cates, data];
      }
    }

    await this.fieldRepository.save(findField);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new category successfully',
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
      message: 'Update category by id successfully',
      data: updateCategory,
    };
  }

  async remove(removeDto: any, id: number): Promise<ApiResponseDto<any>> {
    if (!removeDto) {
      throw new BadRequestException('Bad request');
    }
    const findCategory: any = this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!findCategory) {
      throw new NotFoundException('Not found company');
    }

    findCategory.status = removeDto.status;
    await this.categoryRepository.save(findCategory);

    return {
      statusCode: HttpStatus.OK,
      message: 'Removed the category successful',
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
      message: 'Delete category by id successfully',
      data: category,
    };
  }
}
