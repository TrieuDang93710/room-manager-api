/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicantEntity } from '../entities/applicant.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { CompanyEntity } from 'src/company/entities/company.entity';

@Injectable()
export class ApplicantService {
  constructor(
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<ApplicantEntity[]>> {
    const data = await this.applicantRepository.find({
      relations: {
        user: true,
        saves: true,
        companies: true,
        wishlists: true,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all applicant successfully',
      data: data,
    };
  }

  async findById(id: number): Promise<ApiResponseDto<any>> {
    const queryBuilder = this.applicantRepository
      .createQueryBuilder('applicant')
      .leftJoin('applicant.user', 'user')
      .leftJoin('user.senderMessages', 'senderMessages')
      .leftJoin('user.receiverMessages', 'receiverMessages')

      .leftJoin('applicant.saves', 'saves')
      .leftJoin('saves.type_of_post', 'type_of_post')
      .leftJoin('saves.company', 'company')
      .leftJoin('saves.require', 'require')
      .leftJoin('company.work_place', 'work_place')
      .leftJoin('work_place.address', 'address')

      .leftJoin('applicant.wishlists', 'wishlists')
      .leftJoin('wishlists.type_of_post', 'type_of_post_1')
      .leftJoin('wishlists.company', 'company_1')
      .leftJoin('company_1.work_place', 'work_place_1')
      .leftJoin('work_place_1.address', 'address_1')
      .leftJoin('wishlists.require', 'require_1')

      .leftJoin('applicant.companies', 'companies')
      .leftJoin('companies.manager', 'manager')
      .leftJoin('manager.user', 'user_1');

    queryBuilder.addSelect([
      'user.username',
      'user.email',
      'user.role',
      'senderMessages.text',
      'senderMessages.image',
      'senderMessages.createAt',
      'receiverMessages.text',
      'receiverMessages.image',
      'receiverMessages.createAt',
    ]);
    queryBuilder.addSelect([
      'saves.title',
      'saves.work_type',
      'saves.salary',
      'saves.createAt',
      'saves.duration',
      'type_of_post.title',
      'company.title',
      'company.logo',
      'require.experience',
      'require.gender',
      'require.quantity',
      'require.level',
      'require.education',
      'work_place.coordinate',
      'work_place.latitude',
      'address.national',
      'address.city',
      'address.district',
      'address.village',
    ]);
    queryBuilder.addSelect([
      'wishlists.title',
      'wishlists.work_type',
      'wishlists.salary',
      'wishlists.createAt',
      'wishlists.duration',
      'type_of_post_1.title',
      'company_1.title',
      'company_1.logo',
      'work_place_1.coordinate',
      'work_place_1.latitude',
      'address_1.national',
      'address_1.city',
      'address_1.district',
      'address_1.village',
      'require_1.experience',
      'require_1.gender',
      'require_1.quantity',
      'require_1.level',
      'require_1.education',
    ]);
    queryBuilder.addSelect([
      'companies.id',
      'companies.title',
      'companies.logo',
      'companies.scale',
      'companies.information',
      'manager.id',
      'user_1.id',
      'user_1.username',
      'user_1.email',
      'user_1.role',
    ]);

    queryBuilder.where('applicant.id = :id', { id: id });

    const query = await queryBuilder.getOne();

    const applicant = query;

    return {
      statusCode: HttpStatus.OK,
      message: 'Get one applicant successfully',
      data: applicant,
    };
  }

  async follow(id: number, user: UserEntity): Promise<ApplicantEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        applicant: true,
      },
    });

    const findCompany = await this.companyRepository.findOne({
      where: {
        id: id,
      },
    });
    const applicantId = findUser.applicant;

    const findApplicant = await this.applicantRepository.findOne({
      where: { id: applicantId.id },
      relations: { companies: true },
    });

    const companies = findApplicant.companies;

    const alreadySave = findApplicant.companies.some(
      (room) => room.id === findCompany.id,
    );

    if (companies === null) {
      findApplicant.companies.push(findCompany);
      return this.applicantRepository.save(findApplicant);
    } else {
      if (alreadySave) {
        findApplicant.companies = findApplicant.companies.filter(
          (room) => room.id !== findCompany.id,
        );
        return this.applicantRepository.save(findApplicant);
      } else {
        findApplicant.companies.push(findCompany);
        return this.applicantRepository.save(findApplicant);
      }
    }
  }
}
