/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import { Role } from 'src/shared/enums/role.enum';
import { UpdateUserDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ApplicantEntity } from './entities/applicant.entity';
import { ManagerEntity } from './entities/manager.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ApplicantEntity)
    private readonly applicantRepository: Repository<ApplicantEntity>,
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<UserEntity[]>> {
    const data = await this.userRepository.find({
      relations: {
        address: true,
        applicant: {
          resumes: true,
          saves: true,
          wishlists: true,
          applies: {
            post: true,
            resume: true
          },
        },
        manager: {
          packages: true,
          posts: true,
        },
        senderMessages: true,
        receiverMessages: true,
      },
      select: {
        address: {
          id: true,
          national: true,
          city: true,
          district: true,
          village: true,
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Not found');
    }
    const roleNotAdminFiltered = data.filter(
      (item) => item.role.toString() !== Role.ADMIN,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all user successfully',
      data: roleNotAdminFiltered,
    };
  }

  async findById(id: number): Promise<ApiResponseDto<UserEntity>> {
    const data: any = await this.userRepository.find({
      where: {
        id: id,
      },
      relations: {
        address: true,
        applicant: true,
        manager: true,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get user successfully',
      data: data,
    };
  }

  async findUserByEmail(email: string): Promise<ApiResponseDto<UserEntity>> {
    const data = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!data) {
      throw new NotFoundException('Not found user by this email');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Get a user by email successfully',
      data: data,
    };
  }

  async findAllApplicants(): Promise<ApiResponseDto<ApplicantEntity[]>> {
    const data = await this.applicantRepository.find({
      relations: {
        user: true,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all tenant successfully',
      data: data,
    };
  }

  async findAdminByEmail(
    email: string,
  ): Promise<ApiResponseDto<{ isAdmin: boolean }>> {
    const userAlreadyExisted: any = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    let isAdmin: boolean;
    if (!userAlreadyExisted) {
      throw new NotFoundException('User not found');
    }
    if (userAlreadyExisted.role[0] !== Role.ADMIN) {
      isAdmin = false;
      return {
        statusCode: HttpStatus.OK,
        message: 'User must not be administration',
        data: { isAdmin },
      };
    }
    isAdmin = true;
    return {
      statusCode: HttpStatus.OK,
      message: 'Get admin successful',
      data: { isAdmin },
    };
  }

  async findManagerByEmail(
    email: string,
  ): Promise<ApiResponseDto<{ isManager: boolean }>> {
    const userAlreadyExisted: any = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    let isManager: boolean;
    if (!userAlreadyExisted) {
      throw new NotFoundException('User not found');
    }
    if (userAlreadyExisted.role[0] !== Role.MANAGER) {
      isManager = false;
      return {
        statusCode: HttpStatus.OK,
        message: 'User must not be management',
        data: {
          isManager,
        },
      };
    }
    isManager = true;
    return {
      statusCode: HttpStatus.OK,
      message: 'Get manager successful',
      data: {
        isManager,
      },
    };
  }

  async decentralization(
    id: number,
    decentralizeDto: any,
  ): Promise<ApiResponseDto<UserEntity>> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!decentralizeDto) {
      throw new BadRequestException('Not found request');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (decentralizeDto.role[0] === Role.MANAGER) {
      console.log(user.applicant);
      const manager = this.managerRepository.create();

      user.role = decentralizeDto.role;
      user.applicant = null;
      user.manager = manager;

      await this.userRepository.save(user);

      manager.user = user;
      await this.managerRepository.save(manager);
      // await this.tenantRepository.remove(user.tenant);
    } else {
      user.role = decentralizeDto.role;
      user.applicant = null;
      user.manager = null;

      await this.userRepository.save(user);
      // await this.tenantRepository.remove(user.tenant);
      // await this.managerRepository.remove(user.manager);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Decentralization successful',
      data: user,
    };
  }

  async updateUser(
    updateUserDto: UpdateUserDto,
    user: UserEntity,
  ): Promise<ApiResponseDto<UserEntity>> {
    const findUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!findUser) {
      throw new NotFoundException('Not found user');
    }
    await this.userRepository.update(user.id, {
      date_of_birth: updateUserDto.date_of_birth,
      avatar: updateUserDto.avatar,
      phone: updateUserDto.phone,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Update user successful',
      data: findUser,
    };
  }

  async remove(id: number): Promise<ApiResponseDto<any>> {
    const result = await this.userRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Delete user successful',
      data: result,
    };
  }
}
