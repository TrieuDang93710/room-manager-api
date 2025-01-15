/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get()
  async getAllAddress() {
    return this.addressService.findAll();
  }
}
