/* eslint-disable prettier/prettier */

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<RatingEntity[]>> {
    const ratings = await this.ratingRepository.find({
      relations: {
        post: true,
        userId: true,
      },
      select: {
        post: {
          id: true,
          title: true,
          status: true,
        },
        userId: {
          id: true,
          username: true,
          email: true,
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Successful',
      data: ratings,
    };
  }
}
