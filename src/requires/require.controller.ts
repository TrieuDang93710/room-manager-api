/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequireService } from './require.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/guards/role.guard';
import { Roles } from '../user/decorators/role.decorator';
import { Role } from '../shared/enums/role.enum';
import { CreateRequirementDto } from './dto/create.dto';

@Controller('require')
export class RequireController {
  constructor(private requireService: RequireService) {}

  @Post('/:postId')
  @Roles(Role.TENANT, Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async createRequirement(
    @Body()
    createRequirementDto: CreateRequirementDto,
    @Param('postId')
    postId: number,
  ) {
    return this.requireService.create(createRequirementDto, postId);
  }

  @Get()
  async getRequirements() {
    return this.requireService.findAll();
  }
}
