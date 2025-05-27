/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ServicePackageService } from './service_package.service';
import { Roles } from 'src/user/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { Role } from 'src/shared/enums/role.enum';
import { CreateDto } from './dto/create.dto';

@Controller('service-package')
export class ServicePackageController {
  constructor(private readonly servicePackageService: ServicePackageService) {}

  @Get()
  async getServicePackage(
    @Query()
    query: ExpressQuery,
  ) {
    return this.servicePackageService.findAll(query);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createNews(
    @Body()
    newDto: CreateDto,
  ) {
    return this.servicePackageService.create(newDto);
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getById(
    @Param('id')
    id: number,
  ) {
    return this.servicePackageService.findById(id);
  }

  @Patch('/remove/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async removeNews(
    @Param('id')
    id: number,
  ) {
    return this.servicePackageService.remove(id);
  }
}
