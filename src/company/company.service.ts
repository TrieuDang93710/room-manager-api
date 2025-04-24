/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { Brackets, Repository } from 'typeorm';
import { ApiResponseDto } from 'src/dto/response.dto';
import { WorkPlaceEntity } from 'src/work_place/entities/work-place.entity';
import { AddressEntity } from 'src/address/entities/address.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';

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
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
  ) {}

  async findAll(query: Query): Promise<ApiResponseDto<any>> {
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoin('company.posts', 'posts')
      .leftJoin('posts.type_of_post', 'type_of_post')
      .leftJoin('company.work_place', 'work_place')
      .leftJoin('work_place.address', 'address')
      .leftJoin('company.manager', 'manager')
      .leftJoin('manager.user', 'user')

    queryBuilder.addSelect([
      'company.title',
      'company.logo',
      'company.description',
      'company.scale',
      'company.information',
      'company.status',
      'posts.title',
      'posts.description',
      'type_of_post.title',
      'work_place.coordinate',
      'work_place.latitude',
      'address.national',
      'address.district',
      'address.city',
      'address.village',
      'manager.id',
      'user.id',
      'user.username',
      'user.email',
      'user.role',
    ]);

    // find with keyword
    if (query.fields) {
      const fields = query.fields
        .toString()
        .split(',')
        .filter((k: any) => k !== '');

      console.log('fields: ', fields);

      if (fields.length) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            fields.forEach((k: any, idx: any) => {
              qb.orWhere(`type_of_post.title LIKE :title${idx}`, {
                [`title${idx}`]: `%${k}%`,
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
              qb.orWhere(`address.city LIKE :address${idx}`, {
                [`address${idx}`]: `%${k}%`,
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
      message: 'Get all company successfully',
      data: {
        result: result,
        totalItems: total,
        totalPages: totalPages,
        currentPage: currentPage,
      },
    };
  }

  async create(createCompanyDto: any, user: any): Promise<ApiResponseDto<any>> {
    const { title, logo, description, scale,images, information, work_place } =
      createCompanyDto;

    if (!work_place) {
      throw new BadRequestException('work_place has not to be blank');
    }
    // const { coordinate, latitude, address } = work_place;
    if (!work_place.address) {
      throw new BadRequestException('address has not to be blank');
    }

    if (!user) {
      throw new BadRequestException('Bad request');
    }

    const findUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { manager: true },
    });
    const findManager = await this.managerRepository.findOne({
      where: { id: findUser.manager.id },
    });

    const addressReq = work_place.address;
    console.log('contact: ', information);
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
      logo: logo,
      description: description,
      scale: scale,
      images: images,
      information: information,
      work_place: newWorkPlace,
      manager: findManager,
    });
    await this.companyRepository.save(newCompany);

    newWorkPlace.company = newCompany;
    await this.workPlaceRepository.save(newWorkPlace);

    findManager.company = newCompany;
    await this.managerRepository.save(findManager);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Create new company successfully',
      data: newCompany,
    };
  }

  async approve(approveDto: any, id: any): Promise<ApiResponseDto<any>> {
    if (!approveDto) {
      throw new BadRequestException('Bad request');
    }
    console.log('approveDto: ==>', { approveDto, id });
    const findCompany: any = this.companyRepository.findOne({
      where: { id: Number(id) },
    });

    if (!findCompany) {
      throw new NotFoundException('Not found company');
    }

    const result = await this.companyRepository.update(Number(id), approveDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Approved the company successful',
      data: result,
    };
  }

  async remove(removeDto: any, id: number): Promise<ApiResponseDto<any>> {
    if (!removeDto) {
      throw new BadRequestException('Bad request');
    }
    const findCompany: any = this.companyRepository.findOne({
      where: { id: Number(id) },
    });
    if (!findCompany) {
      throw new NotFoundException('Not found company');
    }

    // findCompany.status = removeDto.status;
    // await this.companyRepository.save(findCompany);
    const result = await this.companyRepository.update(Number(id), removeDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Removed the company successful',
      data: result,
    };
  }
}
