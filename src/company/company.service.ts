/* eslint-disable prettier/prettier */
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { Like, Repository } from 'typeorm';
import { ApiResponseDto } from 'src/dto/response.dto';
import { WorkPlaceEntity } from 'src/work_place/entities/work-place.entity';
import { AddressEntity } from 'src/address/entities/address.entity';
import { PostEntity } from 'src/posts/entities/post.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(WorkPlaceEntity)
    private readonly workPlaceRepository: Repository<WorkPlaceEntity>,
    @InjectRepository(AddressEntity)
    private addressRepository: Repository<AddressEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: Like(`%${query.keyword}%`),
        }
      : {};

    const [result, total] = await this.companyRepository.findAndCount({
      where: keyword,
      relations: {
        posts: {
          type_of_post: true,
          require: true,
        },
        work_place: {
          address: true,
        },
      },
      select: {
        posts: {
          id: true,
          title: true,
          description: true,
          type_of_post: {
            title: true,
          },
          require: {
            sex: true,
            age: true,
            description: true,
            quantity: true,
            experience: true,
          },
        },
        work_place: {
          coordinate: true,
          latitude: true,
          address: {
            national: true,
            city: true,
            district: true,
            village: true,
          },
        },
      },
      take: resPerPage,
      skip: skip,
    });

    const totalPages = Math.ceil(total / resPerPage);

    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all company successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async create(createCompanyDto: any): Promise<ApiResponseDto<any>> {
    const { title, contact, work_place } = createCompanyDto;
    if (!work_place) {
      throw new BadRequestException('work_place has not to be blank');
    }
    // const { coordinate, latitude, address } = work_place;
    if (!work_place.address) {
      throw new BadRequestException('address has not to be blank');
    }
    const addressReq = work_place.address;
    console.log('contact: ', contact);
    const newAddress = this.addressRepository.create({
      national: addressReq.national,
      city: addressReq.city,
      district: addressReq.district,
      village: addressReq.village,
    });
    await this.addressRepository.save(newAddress);

    const newWorkPlace = this.workPlaceRepository.create({
      coordinate: work_place.coordinate,
      latitude: work_place.latitude,
      address: newAddress,
    });
    await this.workPlaceRepository.save(newWorkPlace);

    const updateAddress = (newAddress.work_place = newWorkPlace);
    await this.addressRepository.save(updateAddress);

    const newCompany = this.companyRepository.create({
      title: title,
      contact: contact,
      work_place: newWorkPlace,
    });
    await this.companyRepository.save(newCompany);

    const updateWPlace = (newWorkPlace.company = newCompany);
    await this.workPlaceRepository.save(updateWPlace);

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Create new company successfully',
      data: newCompany,
    };
  }
}
