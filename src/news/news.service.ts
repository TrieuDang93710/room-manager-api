/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsEntity } from './entities/news.entity';
import { Repository } from 'typeorm';
import { Query } from 'express-serve-static-core';
import { ApiResponseDto } from '../dto/response.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const queryBuilder = this.newsRepository.createQueryBuilder('news');
    // pagination
    queryBuilder.take(resPerPage).skip(skip);

    const [result, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / resPerPage);

    return {
      statusCode: HttpStatus.OK,
      message: 'Get all news successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async create(newsDto: any): Promise<ApiResponseDto<any>> {
    if (!newsDto) {
      throw new NotFoundException('Not found request');
    }

    const res = this.newsRepository.create(newsDto);
    await this.newsRepository.save(res);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new news successfully',
      data: res,
    };
  }

  async findById(id: number): Promise<ApiResponseDto<any>> {
    const findNews = await this.newsRepository.findOne({ where: { id: id } });

    if (!findNews) {
      throw new NotFoundException('Not found news by id');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Remove news successfully',
      data: findNews,
    };
  }

  async remove(id: number): Promise<ApiResponseDto<any>> {
    const findNews = await this.newsRepository.findOne({ where: { id: id } });

    if (!findNews) {
      throw new NotFoundException('Not found news by id');
    }

    await this.newsRepository.update(id, {
      status: true,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Remove news successfully',
    };
  }
}
