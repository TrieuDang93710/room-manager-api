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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';

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

  @Post()
  async createCompany(
    @Body()
    createCompanyDto: CreateCompanyDto,
  ) {
    return this.companyService.create(createCompanyDto);
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
