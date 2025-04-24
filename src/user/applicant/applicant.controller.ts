/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../../shared/enums/role.enum';
import { ApplicantEntity } from '../entities/applicant.entity';

@Controller('applicant')
export class ApplicantController {
  constructor(private applicantService: ApplicantService) {}

  @Get()
  @Roles(Role.ADMIN, Role.LESSOR, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAll() {
    return this.applicantService.findAll();
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.LESSOR, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getOneApplicant(
    @Param('id')
    id: number,
  ) {
    return this.applicantService.findById(id);
  }

  @Patch('/follow/:id')
  @Roles(Role.ADMIN, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async saves(
    @Req()
    req: any,
    @Param('id')
    id: number,
  ): Promise<ApplicantEntity> {
    return this.applicantService.follow(id, req.user);
  }
}
