/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { ApiResponseDto } from 'src/dto/response.dto';
import { ResumeEntity } from './entities/resume.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
  ) {}

  async create(
    createResumeDto: any,
    user: UserEntity,
  ): Promise<ApiResponseDto<any>> {
    if (!user) {
      throw new BadRequestException('Not found request');
    }

    const userRoleApplicant = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { applicant: true },
    });

    // const findPost = await this.postRepository.findOne({ where: { id: post } });

    // Add contract into db of tenants and db of manager(Lessor)
    const findApplicant = await this.applicantRepository.findOne({
      where: { id: userRoleApplicant.applicant.id },
    });

    const body = {
      title: createResumeDto.title,
      job: createResumeDto.job,
      target: createResumeDto.target,
      image: createResumeDto.image,
      description: createResumeDto.description,
      cv: createResumeDto.cv,
      education: createResumeDto.education,
      level: createResumeDto.level,
      experiences: createResumeDto.experiences,
      certificates: createResumeDto.certificates,
      awards: createResumeDto.awards,
      skills: createResumeDto.skills,
      languages: createResumeDto.languages,
    };

    const newResume = this.resumeRepository.create({
      ...body,
      applicant: findApplicant,
    });

    await this.resumeRepository.save(newResume);

    if (!findApplicant.resumes) {
      findApplicant.resumes = [newResume];
    } else {
      const contractAlreadyExisted = findApplicant.resumes.some(
        (ct) => ct.id === newResume.id,
      );
      if (!contractAlreadyExisted) {
        findApplicant.resumes = [...findApplicant.resumes, newResume];
      }
    }

    // if (!findPost.applies) {
    //   findPost.applies = [newApply];
    // } else {
    //   const contractAlreadyExisted = findPost.applies.some(
    //     (ct) => ct.id === newApply.id,
    //   );
    //   if (!contractAlreadyExisted) {
    //     findPost.applies = [...findPost.applies, newApply];
    //   }
    // }

    await this.applicantRepository.save(findApplicant);
    // await this.postRepository.save(findPost);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new resume successfully',
      data: newResume,
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

    const [result, total] = await this.resumeRepository.findAndCount({
      where: keyword,
      relations: {
        applicant: {
          user: {
            address: true,
          },
        },
        applies: true
      },
      select: {
        applicant: {
          id: true,
          user: {
            username: true,
            email: true,
            role: true,
            address: {
              village: true,
              district: true,
              city: true,
            },
          },
        },
      },
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);

    return {
      statusCode: HttpStatus.OK,
      message: 'Get all resume successfully',
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
  ): Promise<ApiResponseDto<ApiResponseDto<ResumeEntity>>> {
    const resume: any = await this.resumeRepository.findOne({
      where: { id: id },
      relations: {
        applicant: {
          user: {
            address: true,
          },
        },
      },
      select: {
        applicant: {
          id: true,
          user: {
            username: true,
            email: true,
            role: true,
            date_of_birth: true,
            phone: true,
            address: {
              village: true,
              district: true,
              city: true,
            },
          },
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get a resume successfully',
      data: resume,
    };
  }

  async updateById(
    id: number,
    updateContractDto: any,
  ): Promise<ApiResponseDto<ResumeEntity>> {
    const findResume = await this.resumeRepository.findOne({
      where: { id: id },
    });
    if (!findResume) {
      throw new NotFoundException('Not found resume into database');
    }
    const result: any = await this.resumeRepository.update(
      id,
      updateContractDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Update resume successfully',
      data: result,
    };
  }

  async removeById(id: number, statusDto: any): Promise<ApiResponseDto<any>> {
    const findResume = await this.resumeRepository.findOne({
      where: { id: id },
    });
    if (!findResume) {
      throw new NotFoundException('Not found resume into database');
    }
    // findResume.status = statusDto;
    // await this.resumeRepository.save(findResume);
    const result: any = await this.resumeRepository.update(id, statusDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Remove a resume into database',
      data: result,
    };
  }

  async deleteById(id: number): Promise<ApiResponseDto<ResumeEntity>> {
    const result: any = await this.resumeRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all resume successfully',
      data: result,
    };
  }
}
