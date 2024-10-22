/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { TenantModule } from './user/tenant/tenant.module';
import { LessorModule } from './user/lessor/lessor.module';
import { RoomModule } from './room/room.module';
import { CategoryModule } from './category/category.module';
import { ContractModule } from './contract/contract.module';
import { PaymentModule } from './contract/payment/payment.module';
import { RequirementModule } from './requirement/requirement.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'sa123',
    //   database: 'typeorm-room-manager-db',
    //   entities: [],
    //   synchronize: true,
    // }),
    UserModule,
    AddressModule,
    TenantModule,
    LessorModule,
    RoomModule,
    CategoryModule,
    ContractModule,
    PaymentModule,
    RequirementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
