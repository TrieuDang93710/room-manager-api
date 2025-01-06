/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { LessorService } from './lessor.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../../shared/enums/role.enum';

@Controller('lessor')
export class LessorController {
  constructor(private lessorService: LessorService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TENANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async getAll() {
    return this.lessorService.findAll();
  }
}
