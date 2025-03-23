/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ApplyEntity } from './entities/apply.entity';
import { ResumeEntity } from 'src/resume/entities/resume.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(ApplyEntity)
    private readonly applyRepository: Repository<ApplyEntity>,
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(createApplyDto: any, user: any): Promise<ApiResponseDto<any>> {
    if (!createApplyDto || !user) {
      throw new BadRequestException('Not found request');
    }
    const findPost = await this.postRepository.findOne({
      where: { id: createApplyDto.post },
    });

    const findResume = await this.resumeRepository.findOne({
      where: { id: createApplyDto.resume },
    });

    if (!findPost || !findResume) {
      throw new NotFoundException('Not found');
    }

    const newApply: any = this.applyRepository.create(createApplyDto);
    await this.applyRepository.save(newApply);

    if (!findPost.applies) {
      findPost.applies = [newApply];
    } else {
      const contractAlreadyExisted = findPost.applies.some(
        (ct) => ct.id === newApply.id,
      );
      if (!contractAlreadyExisted) {
        findPost.applies = [...findPost.applies, newApply];
      }
    }

    findResume.apply = newApply;
    await this.resumeRepository.save(findResume);

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Create new apply successful',
      data: newApply,
    };
  }

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          description: Like(`%${query.keyword}%`),
        }
      : {};

    const [result, total] = await this.applyRepository.findAndCount({
      where: keyword,
      relations: {
        post: true,
        resume: true,
      },
      select: {},
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all applied successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }
}
