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
import { Brackets, Repository } from 'typeorm';
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

    const queryBuilder = this.resumeRepository
      .createQueryBuilder('resume')
      .leftJoin('resume.applies', 'applies')
      .leftJoin('resume.applicant', 'applicant')
      .leftJoin('applicant.user', 'user')
      .leftJoin('user.address', 'address');

    queryBuilder.addSelect([
      'applies.id',
      'applies.letter',
      'applies.status',
      'applies.description',
      'applicant.id',
      'user.username',
      'user.email',
      'user.role',
      'user.date_of_birth',
      'user.gender',
      'address.national',
      'address.district',
      'address.city',
      'address.village',
    ]);

    if (query.titles) {
      const titles = query.titles
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('titles: ', titles);

      if (titles.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            titles.forEach((k: any, idx: any) => {
              qb.orWhere(`resume.title LIKE :title${idx}`, {
                [`title${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    if (query.jobs) {
      const jobs = query.jobs
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('jobs: ', jobs);

      if (jobs.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            jobs.forEach((k: any, idx: any) => {
              qb.orWhere(`resume.job LIKE :job${idx}`, {
                [`job${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    if (query.addresses) {
      const addresses = query.addresses
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('addresses: ', addresses);

      if (addresses.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            addresses.forEach((k: any, idx: any) => {
              qb.orWhere(`address.city LIKE :city${idx}`, {
                [`city${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    if (query.levels) {
      const levels = query.levels
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('levels: ', levels);

      if (levels.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            levels.forEach((k: any, idx: any) => {
              qb.orWhere(`resume.level LIKE :level${idx}`, {
                [`level${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    if (query.genders) {
      const genders = query.genders
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('genders: ', genders);

      if (genders.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            genders.forEach((k: any, idx: any) => {
              qb.orWhere(`user.gender::text LIKE :g_der${idx}`, {
                [`g_der${idx}`]: `%${k}%`,
              });
            });
          }),
        );
      }
    }

    // pagination
    queryBuilder.take(resPerPage).skip(skip);

    const [result, total] = await queryBuilder.getManyAndCount();

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

  async findById(id: number): Promise<ApiResponseDto<any>> {
    const queryBuilder = this.resumeRepository
      .createQueryBuilder('resume')
      .leftJoin('resume.applies', 'applies')
      .leftJoin('resume.applicant', 'applicant')
      .leftJoin('applicant.user', 'user')
      .leftJoin('user.address', 'address');

    queryBuilder.addSelect([
      'applies.id',
      'applies.letter',
      'applies.status',
      'applies.description',
      'applicant.id',
      'user.username',
      'user.email',
      'user.role',
      'user.date_of_birth',
      'user.gender',
      'address.national',
      'address.district',
      'address.city',
      'address.village',
    ]);
    queryBuilder.where('resume.id = :id', { id: id });

    const query = await queryBuilder.getOne();

    const resumeItem = query;
    return {
      statusCode: HttpStatus.OK,
      message: 'Get a resume successfully',
      data: resumeItem,
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
