/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ManagerEntity } from '../user/entities/manager.entity';
import { ServicePackageEntity } from '../service_package/entities/service_package.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      PaymentEntity,
      UserEntity,
      ServicePackageEntity,
      ManagerEntity,
    ]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
