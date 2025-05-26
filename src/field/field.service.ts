/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { FieldEntity } from './entities/field.entity';
import { CreateFieldDto } from './dto/create.dto';
import { UpdateFieldDto } from './dto/update.dto';

@Injectable()
export class FieldService {
  constructor(
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

    const [result, total] = await this.fieldRepository.findAndCount({
      where: keyword,
      relations: {
        cates: true,
      },
      select: {
        cates: {
          id: true,
          title: true,
          description: true,
        },
      },
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);
    // const data = await this.fieldRepository.find({
    //   relations: { rooms: true },
    // });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all field successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async findById(id: number): Promise<ApiResponseDto<FieldEntity>> {
    const field = await this.fieldRepository.findOne({
      where: { id: id },
      relations: { cates: true },
    });
    if (!field) {
      throw new NotFoundException('Not found field by id');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Get field information by id successfully',
      data: field,
    };
  }

  async create(field: CreateFieldDto): Promise<ApiResponseDto<FieldEntity>> {
    const data = this.fieldRepository.create({
      title: field.title,
      slug: field.title.toLocaleLowerCase().replaceAll(' ', '_'),
      description: field.description,
    });
    await this.fieldRepository.save(data);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new field successfully',
      data: data,
    };
  }

  async updateById(
    id: number,
    updateDto: UpdateFieldDto,
  ): Promise<ApiResponseDto<FieldEntity>> {
    const field = await this.fieldRepository.findOne({
      where: { id: id },
    });
    if (!field) {
      throw new NotFoundException('Not found field by id');
    }
    const updateField: any = await this.fieldRepository.update(id, {
      title: updateDto.title,
      description: updateDto.description,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Update Field by id successfully',
      data: updateField,
    };
  }

  async remove(removeDto: any, id: number): Promise<ApiResponseDto<any>> {
    if (!removeDto) {
      throw new BadRequestException('Bad request');
    }
    const findField: any = this.fieldRepository.findOne({
      where: { id: id },
    });
    if (!findField) {
      throw new NotFoundException('Not found field');
    }

    findField.status = removeDto.status;
    await this.fieldRepository.save(findField);

    return {
      statusCode: HttpStatus.OK,
      message: 'Removed the field successful',
    };
  }

  async deleteById(id: number): Promise<ApiResponseDto<FieldEntity>> {
    const field = await this.fieldRepository.findOne({
      where: { id: id },
    });
    if (!field) {
      throw new NotFoundException('Not found field by id');
    }
    await this.fieldRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Delete field by id successfully',
      data: field,
    };
  }
}
