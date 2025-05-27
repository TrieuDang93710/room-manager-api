/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicePackageEntity } from './entities/service_package.entity';
import { Repository } from 'typeorm';
import { Query } from 'express-serve-static-core';
import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';
import { ApiResponseDto } from 'src/dto/response.dto';

@Injectable()
export class ServicePackageService {
  constructor(
    @InjectRepository(ServicePackageEntity)
    private readonly servicePackageRepository: Repository<ServicePackageEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
  ) {}

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const queryBuilder =
      this.servicePackageRepository.createQueryBuilder('ser_package');

    // pagination
    queryBuilder.take(resPerPage).skip(skip);

    const [result, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / resPerPage);

    return {
      statusCode: HttpStatus.OK,
      message: 'Get all service package successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async create(newDto: any): Promise<ApiResponseDto<any>> {
    if (!newDto) {
      throw new NotFoundException('Not found request');
    }

    const res = this.servicePackageRepository.create(newDto);
    await this.servicePackageRepository.save(res);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new service package successfully',
      data: res,
    };
  }

  async findById(id: number): Promise<ApiResponseDto<any>> {
    const findOnePackage = await this.servicePackageRepository.findOne({
      where: { id: id },
    });

    if (!findOnePackage) {
      throw new NotFoundException('Not found service package by id');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Get one service package successfully',
      data: findOnePackage,
    };
  }

  async remove(id: number): Promise<ApiResponseDto<any>> {
    const findNews = await this.servicePackageRepository.findOne({
      where: { id: id },
    });

    if (!findNews) {
      throw new NotFoundException('Not found news by id');
    }

    await this.servicePackageRepository.update(id, {
      status: true,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Remove service package successfully',
    };
  }
}
