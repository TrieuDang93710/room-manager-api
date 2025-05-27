/* eslint-disable prettier/prettier */
import {
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
import { UserEntity } from 'src/user/entities/user.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(ApplyEntity)
    private readonly applyRepository: Repository<ApplyEntity>,
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
  ) {}

  async create(createApplyDto: any, user: any): Promise<ApiResponseDto<any>> {
    if (!createApplyDto || !user) {
      throw new NotFoundException('Not found request');
    }
    const findPost = await this.postRepository.findOne({
      where: { id: Number(createApplyDto.post) },
      relations: { applies: true },
    });

    const findResume = await this.resumeRepository.findOne({
      where: { id: Number(createApplyDto.resume) },
      relations: { applies: true },
    });

    const findUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { applicant: true },
    });
    const findApplicant = await this.applicantRepository.findOne({
      where: { id: findUser.applicant.id },
      relations: { applies: true },
    });

    if (!findPost || !findResume || !findApplicant) {
      throw new NotFoundException('Not found');
    }

    const newApply: any = this.applyRepository.create({
      description: createApplyDto.description,
      letter: createApplyDto.letter,
      post: findPost,
      resume: findResume,
      applicant: findApplicant,
    });
    await this.applyRepository.save(newApply);

    if (!findPost.applies) {
      findPost.applies = [newApply];
    } else {
      const applyAlreadyExisted = findPost.applies.some(
        (ct) => ct.id === newApply.id,
      );
      if (applyAlreadyExisted === false) {
        findPost.applies = [...findPost.applies, newApply];
      }
    }

    if (!findResume.applies) {
      findResume.applies = [newApply];
    } else {
      const applyAlreadyExisted = findResume.applies.some(
        (ct) => ct.id === newApply.id,
      );
      if (applyAlreadyExisted === false) {
        findResume.applies = [...findResume.applies, newApply];
      }
    }

    if (!findApplicant.applies) {
      findApplicant.applies = [newApply];
    } else {
      const applyAlreadyExisted = findApplicant.applies.some(
        (ct) => ct.id === newApply.id,
      );
      if (applyAlreadyExisted === false) {
        findApplicant.applies = [...findApplicant.applies, newApply];
      }
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new apply successful',
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
        post: {
          company: true,
          type_of_post: true,
        },
        resume: {
          applicant: {
            user: true,
          },
        },
        applicant: {
          user: true,
        },
      },
      select: {
        applicant: {
          id: true,
          user: {
            username: true,
            email: true,
            role: true,
          },
        },
      },
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all applied successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async findById(id: number): Promise<ApiResponseDto<any>> {
    const findApply = await this.applyRepository.findOne({ where: { id: id } });
    if (!findApply) {
      throw new NotFoundException('Not found apply into database');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Get a apply into database',
      data: findApply,
    };
  }

  async removeById(id: number, statusDto: any): Promise<ApiResponseDto<any>> {
    const findApply = await this.applyRepository.findOne({ where: { id: id } });
    if (!findApply) {
      throw new NotFoundException('Not found apply into database');
    }

    await this.applyRepository.update(id, statusDto);

    // findApply.status = statusDto;
    // await this.applyRepository.save(findApply);

    return {
      statusCode: HttpStatus.OK,
      message: 'Remove a apply into database',
    };
  }

  async updateById(id: number, statusDto: any): Promise<ApiResponseDto<any>> {
    const findApply = await this.applyRepository.findOne({ where: { id: id } });
    if (!findApply) {
      throw new NotFoundException('Not found apply into database');
    }

    await this.applyRepository.update(id, statusDto);

    // findApply.status = statusDto;
    // await this.applyRepository.save(findApply);

    return {
      statusCode: HttpStatus.OK,
      message: 'Update a apply into database',
    };
  }
}
