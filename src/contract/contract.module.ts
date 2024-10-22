/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractSchema } from './schemas/contract.schema';
import { PaymentSchema } from './payment/schemas/payment.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { RoomSchema } from 'src/room/schemas/room.schema';
import { UserModule } from 'src/user/user.module';
import { TenantSchema } from 'src/user/schemas/tenant.schema';
import { LessorSchema } from 'src/user/schemas/lessor.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'Contract', schema: ContractSchema },
      { name: 'Payment', schema: PaymentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Room', schema: RoomSchema },
      { name: 'Tenant', schema: TenantSchema },
      { name: 'Lessor', schema: LessorSchema }
    ])
  ],
  controllers: [ContractController],
  providers: [ContractService]
})
export class ContractModule { }
