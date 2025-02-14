/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApplyService } from './apply.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { CreateContractDto } from './dto/create.dto';

@Controller('apply')
export class ApplyController {
  constructor(private applyService: ApplyService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async createContract(
    @Body()
    createContractDto: CreateContractDto,
    @Req()
    req: any,
  ) {
    return this.applyService.create(createContractDto, req.user);
  }

  @Get()
  async getContracts(
    @Query()
    query: ExpressQuery,
  ) {
    return this.applyService.findAll(query);
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getContract(
    @Param('id')
    id: number,
  ) {
    return this.applyService.findById(id);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateContract(
    @Param('id')
    id: number,
    @Body()
    updateContractDto: any,
  ) {
    return this.applyService.updateById(id, updateContractDto);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteContract(
    @Param('id')
    id: number,
  ) {
    return this.applyService.deleteById(id);
  }
}
