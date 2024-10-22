/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './schemas/address.schema';

@Controller('address')
export class AddressController {
    constructor(
        private addressService: AddressService
    ){}

    @Get()
    async getAllAddress(): Promise<Address[]> {
        return this.addressService.findAll()
    }
}
