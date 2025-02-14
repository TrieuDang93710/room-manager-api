/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ServicePackageService } from './service_package.service';
import { ServicePackageController } from './service_package.controller';

@Module({
  providers: [ServicePackageService],
  controllers: [ServicePackageController]
})
export class ServicePackageModule {}
