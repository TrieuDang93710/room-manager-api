/* eslint-disable prettier/prettier */
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { ApiResponseDto } from 'src/dto/response.dto';
import { ApplyEntity } from './entities/apply.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateContractDto } from './dto/create.dto';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(ApplyEntity)
    private readonly applyRepository: Repository<ApplyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
  ) {}

  async create(
    createContractDto: CreateContractDto,
    user: UserEntity,
  ): Promise<ApiResponseDto<any>> {
    const { apply, applicant, post } = createContractDto;

    if (!apply || !applicant || !post) {
      throw new BadRequestException('Not found request');
    }

    const userRoleApplicant = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { applicant: true },
    });

    const findPost = await this.postRepository.findOne({ where: { id: post } });

    // Add contract into db of tenants and db of manager(Lessor)
    const findApplicant = await this.applicantRepository.findOne({
      where: { id: userRoleApplicant.applicant.id },
    });

    const newApply = this.applyRepository.create({
      applicant: findApplicant,
      post: findPost,
    });

    await this.applyRepository.save(newApply);

    if (!findApplicant.applies) {
      findApplicant.applies = [newApply];
    } else {
      const contractAlreadyExisted = findApplicant.applies.some(
        (ct) => ct.id === newApply.id,
      );
      if (!contractAlreadyExisted) {
        findApplicant.applies = [...findApplicant.applies, newApply];
      }
    }

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

    await this.applicantRepository.save(findApplicant);
    await this.postRepository.save(findPost);

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Create new contract successfully',
      data: newApply,
    };
  }

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: Like(`%${query.keyword}%`),
        }
      : {};

    const [result, total] = await this.applyRepository.findAndCount({
      where: keyword,
      relations: {
        applicant: {
          user: true,
        },
        post: true,
      },
      select: {
        post: {
          title: true,
          description: true,
          status: true,
        },
      },
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all room successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async findById(
    id: number,
  ): Promise<ApiResponseDto<ApiResponseDto<ApplyEntity>>> {
    const contract: any = await this.applyRepository.findOne({
      where: { id: id },
      relations: { applicant: true, post: true },
      select: {
        post: {
          title: true,
          description: true,
          status: true,
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get a contract successfully',
      data: contract,
    };
  }

  async updateById(
    id: number,
    updateContractDto: any,
  ): Promise<ApiResponseDto<ApplyEntity>> {
    const result: any = await this.applyRepository.update(
      id,
      updateContractDto,
    );
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Update room successfully',
      data: result,
    };
  }

  async deleteById(id: number): Promise<ApiResponseDto<ApplyEntity>> {
    const result: any = await this.applyRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all room successfully',
      data: result,
    };
  }
}
