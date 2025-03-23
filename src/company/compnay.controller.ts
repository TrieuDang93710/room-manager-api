/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

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
}
