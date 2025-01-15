/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../../shared/enums/role.enum';

@Controller('tenant')
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Get()
  @Roles(Role.ADMIN, Role.LESSOR)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAll() {
    return this.tenantService.findAll();
  }
}