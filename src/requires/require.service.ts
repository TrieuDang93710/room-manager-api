/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequireEntity } from './entities/require.entity';
import { Repository } from 'typeorm';
import { PostEntity } from '../posts/entities/post.entity';
import { CreateRequirementDto } from './dto/create.dto';
import { ApiResponseDto } from '../dto/response.dto';

@Injectable()
export class RequireService {
  constructor(
    @InjectRepository(RequireEntity)
    private readonly requireRepository: Repository<RequireEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(
    requirement: CreateRequirementDto,
    roomId: number,
  ): Promise<ApiResponseDto<RequireEntity>> {
    const findRoom = await this.postRepository.findOne({
      where: { id: roomId },
    });

    const res = this.requireRepository.create({
      description: requirement.description,
      post: findRoom,
    });

    await this.requireRepository.save(res);

    findRoom.require = res;
    await this.postRepository.save(findRoom);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create successful',
      data: res,
    };
  }

  async findAll(): Promise<ApiResponseDto<RequireEntity[]>> {
    const result = await this.requireRepository.find({
      relations: {
        post: true,
      },
      select: {
        post: {
          title: true,
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all successful',
      data: result,
    };
  }
}
