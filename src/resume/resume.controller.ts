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
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { CreateResumeDto } from './dto/create.dto';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async createResume(
    @Body()
    createResumeDto: CreateResumeDto,
    @Req()
    req: any,
  ) {
    return this.resumeService.create(createResumeDto, req.user);
  }

  @Get()
  async getResumes(
    @Query()
    query: ExpressQuery,
  ) {
    return this.resumeService.findAll(query);
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getResume(
    @Param('id')
    id: number,
  ) {
    return this.resumeService.findById(id);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateResume(
    @Param('id')
    id: number,
    @Body()
    updateContractDto: any,
  ) {
    return this.resumeService.updateById(id, updateContractDto);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteResume(
    @Param('id')
    id: number,
  ) {
    return this.resumeService.deleteById(id);
  }
}
