/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Role } from 'src/shared/enums/role.enum';
import { ManagerEntity } from 'src/user/entities/manager.entity';
import { ServicePackageEntity } from 'src/service_package/entities/service_package.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ManagerEntity)
    private readonly managerRepository: Repository<ManagerEntity>,
    @InjectRepository(ServicePackageEntity)
    private readonly servicePackageEntity: Repository<ServicePackageEntity>,
  ) {}

  async findAll(): Promise<ApiResponseDto<PaymentEntity[]>> {
    const data = await this.paymentRepository.find({
      relations: {
        package: true,
      },
      select: {},
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get all payment method successfully',
      data: data,
    };
  }

  async create(
    createPaymentDto: any,
    user: UserEntity,
    id: number,
  ): Promise<ApiResponseDto<any>> {
    if (user.role[0] !== Role.USER) {
      throw new NotAcceptableException(
        'Only user role allow to create new payment',
      );
    }
    const findUser: any = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: { manager: true },
    });

    const findServicePackage = await this.servicePackageEntity.findOne({
      where: { id: id },
    });

    const newPayment = this.paymentRepository.create({
      amount: createPaymentDto.amount,
      surcharge: createPaymentDto.surcharge,
    });

    if (createPaymentDto.paymentType !== null) {
      newPayment.paymentType = createPaymentDto.paymentType;
    }

    if (createPaymentDto.paymentMethod !== null) {
      newPayment.paymentMethod = createPaymentDto.paymentMethod;
    }

    await this.paymentRepository.save(newPayment);

    const findManager = await this.managerRepository.findOne({
      where: { id: findUser.manager },
      relations: { account_pay: true },
    });

    if (!findManager.account_pay) {
      findManager.account_pay = [newPayment];
    } else {
      const paymentAlreadyExisted = findManager.account_pay.some(
        (pay) => pay.id === newPayment.id,
      );
      if (!paymentAlreadyExisted) {
        findManager.account_pay = [...findManager.account_pay, newPayment];
      }
    }

    if (!findServicePackage.payments) {
      findServicePackage.payments = [newPayment];
    } else {
      const paymentAlreadyExisted = findServicePackage.payments.some(
        (pay) => pay.id === newPayment.id,
      );
      if (!paymentAlreadyExisted) {
        findServicePackage.payments = [
          ...findServicePackage.payments,
          newPayment,
        ];
      }
    }

    await this.servicePackageEntity.save(findServicePackage);
    await this.userRepository.save(findUser);

    return {
      statusCode: HttpStatus.CREATED,
      statusMessage: 'Created successful',
      data: newPayment,
    };
  }

  async findById(id: number): Promise<ApiResponseDto<PaymentEntity>> {
    const data = await this.paymentRepository.findOne({
      where: { id: id },
      relations: { package: true },
    });
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Get a payment method successfully',
      data: data,
    };
  }

  async updateById(
    id: number,
    updatePaymentDto: any,
  ): Promise<ApiResponseDto<PaymentEntity>> {
    const result: any = await this.paymentRepository.update(
      id,
      updatePaymentDto,
    );
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Update payment method successfully',
      data: result,
    };
  }

  async deleteById(id: number): Promise<ApiResponseDto<PaymentEntity>> {
    const result: any = await this.paymentRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      statusMessage: 'Update payment method successfully',
      data: result,
    };
  }
}
