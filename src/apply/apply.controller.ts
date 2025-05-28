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
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApplyService } from './apply.service';
import { Roles } from '../user/decorators/role.decorator';
import { Role } from '../shared/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/guards/role.guard';
import { CreateApplyDto } from './dto/create.dto';
import { StatusDto } from './dto/status.gto';

@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAllApplies(
    @Query()
    query: ExpressQuery,
  ) {
    return this.applyService.findAll(query);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async createNewApply(
    @Body()
    createApplyDto: CreateApplyDto,
    @Req()
    req: any,
  ) {
    return this.applyService.create(createApplyDto, req.user);
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getApplyById(
    @Param('id')
    id: number,
  ) {
    return this.applyService.findById(id);
  }

  @Patch('/remove/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async removeApplyById(
    @Param('id')
    id: number,
    @Body()
    statusDto: StatusDto,
  ) {
    return this.applyService.removeById(id, statusDto);
  }

  @Patch('/update/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateApplyById(
    @Param('id')
    id: number,
    @Body()
    statusDto: StatusDto,
  ) {
    return this.applyService.updateById(id, statusDto);
  }
}
