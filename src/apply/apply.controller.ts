/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApplyService } from './apply.service';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { CreateApplyDto } from './dto/create.dto';

@Controller('apply')
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Get()
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
}
