/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ManagerEntity } from 'src/user/entities/manager.entity';
import { ServicePackageEntity } from 'src/service_package/entities/service_package.entity';
import { UserModule } from 'src/user/user.module';

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
