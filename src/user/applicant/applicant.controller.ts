/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApplicantService } from './applicant.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../../shared/enums/role.enum';

@Controller('applicant')
export class ApplicantController {
  constructor(private applicantService: ApplicantService) {}

  @Get()
  @Roles(Role.ADMIN, Role.LESSOR, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAll() {
    return this.applicantService.findAll();
  }
}