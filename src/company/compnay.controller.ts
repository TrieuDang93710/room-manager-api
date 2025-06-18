/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/guards/role.guard';
import { Roles } from '../user/decorators/role.decorator';
import { Role } from '../shared/enums/role.enum';

@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  async getAllCompany(
    @Query()
    query: ExpressQuery,
  ) {
    return this.companyService.findAll(query);
  }

  @Get('/get-by-email')
  async getAllCompanyByEmail(
    @Query()
    query: ExpressQuery,
  ) {
    return this.companyService.findAllByEmail(query);
  }

  @Post()
  @Roles(Role.MANAGER, Role.APPLICANT, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createCompany(
    @Body()
    createCompanyDto: CreateCompanyDto,
    @Req()
    req: any,
  ) {
    return this.companyService.create(createCompanyDto, req.user);
  }

  @Get('/:id')
  async getACompany(
    @Param('id')
    id: number,
  ) {
    return this.companyService.findById(id);
  }

  @Patch('/approve/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async approveCompany(
    @Param('id')
    id: number,
    @Body()
    approvedDto: any,
  ) {
    return this.companyService.approve(approvedDto, id);
  }

  @Patch('/remove/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async removeCompany(
    @Param('id')
    id: number,
    @Body()
    removedDto: any,
  ) {
    return this.companyService.remove(removedDto, id);
  }
}
