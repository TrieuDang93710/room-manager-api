/* eslint-disable prettier/prettier */

import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from './entities/rating.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from '../dto/response.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<RatingEntity[]>> {
    const ratings = await this.ratingRepository.find({
      relations: {
        userId: true,
      },
      select: {
        star: true,
        comment: true,
        userId: {
          id: true,
          username: true,
          email: true,
          avatar: true
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Successful',
      data: ratings,
    };
  }

  async create(
    star: any,
    comment: string,
    user: any,
  ): Promise<ApiResponseDto<any>> {
    if (!star || !comment) {
      throw new NotFoundException('Not found request');
    }

    const newComment = this.ratingRepository.create({
      star: star,
      comment: comment,
      userId: user,
    });

    await this.ratingRepository.save(newComment);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new comment',
      data: newComment,
    };
  }
}
