/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ServicePackageService } from './service_package.service';
import { ServicePackageController } from './service_package.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicePackageEntity } from './entities/service_package.entity';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { ManagerEntity } from '../user/entities/manager.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      ServicePackageEntity,
      PaymentEntity,
      ManagerEntity,
    ]),
  ],
  providers: [ServicePackageService],
  controllers: [ServicePackageController],
})
export class ServicePackageModule {}
