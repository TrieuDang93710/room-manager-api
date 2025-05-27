/* eslint-disable prettier/prettier */
import {
  HttpStatus,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ApiResponseDto } from 'src/dto/response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Role } from 'src/shared/enums/role.enum';
import { ManagerEntity } from 'src/user/entities/manager.entity';
import { ServicePackageEntity } from 'src/service_package/entities/service_package.entity';
import { Stripe } from 'stripe';

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

  private readonly stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
    apiVersion: '2025-04-30.basil',
  });

  async findAll(): Promise<ApiResponseDto<PaymentEntity[]>> {
    const data = await this.paymentRepository.find({
      relations: {
        package: true,
      },
      select: {},
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Get all payment method successfully',
      data: data,
    };
  }

  async create(
    createPaymentDto: any,
    user: UserEntity,
    id: number,
  ): Promise<ApiResponseDto<any>> {
    if (user.role[0] !== Role.MANAGER) {
      throw new NotAcceptableException(
        'Only manager role allow to create new payment',
      );
    }
    const findUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: { manager: true },
    });

    const manager = await this.managerRepository.findOne({
      where: { id: findUser.manager.id },
    });

    const findServicePackage = await this.servicePackageEntity.findOne({
      where: { id: id },
    });

    const newPayment = this.paymentRepository.create({
      email: createPaymentDto.email,
      amount: createPaymentDto.amount,
      surcharge: createPaymentDto.surcharge,
      total: createPaymentDto.total,
      paymentMethod: createPaymentDto.paymentMethod,
      paymentDate: createPaymentDto.paymentDate,
      cardType: createPaymentDto.cardType,
      status: createPaymentDto.status,
      paymentId: createPaymentDto.paymentId,
      buyer: manager,
      package: findServicePackage,
    });

    await this.paymentRepository.save(newPayment);

    const findManager = await this.managerRepository.findOne({
      where: { id: manager.id },
      relations: { account_pay: true, packages: true },
    });

    const packageExisted = findManager.packages.some(
      (pay) => pay.id === findServicePackage.id,
    );

    if (newPayment && packageExisted === false) {
      findManager.news = findManager.news + findServicePackage.news_quantity;
    }

    if (!findManager.account_pay) {
      findManager.account_pay = [newPayment];
    } else {
      const paymentAlreadyExisted = findManager.account_pay.some(
        (pay) => pay.id === newPayment.id,
      );
      if (paymentAlreadyExisted === false) {
        findManager.account_pay = [...findManager.account_pay, newPayment];
      }
    }

    if (!findManager.packages) {
      findManager.packages = [findServicePackage];
    } else {
      const packageAlreadyExisted = findManager.packages.some(
        (pay) => pay.id === findServicePackage.id,
      );
      if (packageAlreadyExisted === false) {
        findManager.packages = [...findManager.packages, findServicePackage];
      }
    }

    await this.managerRepository.save(findManager);

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
      message: 'Created successful',
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
      message: 'Get a payment method successfully',
      data: data,
    };
  }

  async findByEmail(email: string): Promise<ApiResponseDto<PaymentEntity[]>> {
    const data = await this.paymentRepository.find();
    const filter = data.filter((item: any) => item.email === email);
    return {
      statusCode: HttpStatus.OK,
      message: 'Get a payment by email successfully',
      data: filter,
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
      message: 'Update payment method successfully',
      data: result,
    };
  }

  async deleteById(id: number): Promise<ApiResponseDto<PaymentEntity>> {
    const result: any = await this.paymentRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Update payment method successfully',
      data: result,
    };
  }

  async createPaymentIntent(
    body: any,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    if (!body) {
      throw new NotFoundException('Not found body');
    }
    const pr = (Number(body.price) / 25930) * 100;
    const amount = Number(pr.toFixed());
    return this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
  }
}
