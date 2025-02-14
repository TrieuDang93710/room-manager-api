/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<AddressEntity[]>> {
    const data = await this.addressRepository.find({
      relations: {
        user: true,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all address successfully',
      data: data,
    };
  }
}
