/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerEntity } from '../entities/manager.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LessorService {
  constructor(
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<ManagerEntity[]>> {
    const data = await this.managerRepository.find({
      relations: {
        user: true,
        posts: true,
        packages: true,
      },
      select: {
        user: {
          username: true,
          email: true,
          role: true,
        },
        posts: {
          title: true,
          description: true,
          images: true,
          video: true,
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all lessor successfully',
      data: data,
    };
  }
}
