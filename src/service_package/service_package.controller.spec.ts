/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ServicePackageController } from './service_package.controller';

describe('ServicePackageController', () => {
  let controller: ServicePackageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicePackageController],
    }).compile();

    controller = module.get<ServicePackageController>(ServicePackageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
