/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantEntity } from '../entities/applicant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicantService {
  constructor(
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<ApplicantEntity[]>> {
    const data = await this.applicantRepository.find({
      relations: {
        user: true,
        saves: true,
        followers: true,
        wishlists: true,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all tenant successfully',
      data: data,
    };
  }
}
