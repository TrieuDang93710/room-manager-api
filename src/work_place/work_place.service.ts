/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkPlaceEntity } from './entities/work-place.entity';
import { Repository } from 'typeorm';
import { ApiResponseDto } from '../dto/response.dto';

@Injectable()
export class WorkPlaceService {
  constructor(
    @InjectRepository(WorkPlaceEntity)
    private readonly workPlaceRepository: Repository<WorkPlaceEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<any>> {
    const data = await this.workPlaceRepository.find({
      relations: {
        address: true,
      },
      select: {
        address: {
          national: true,
          city: true,
          district: true,
          village: true,
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all work places',
      data: data,
    };
  }
}
