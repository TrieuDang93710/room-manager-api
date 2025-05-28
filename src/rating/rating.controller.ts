/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Roles } from '../user/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/guards/role.guard';
import { Role } from '../shared/enums/role.enum';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  async getAllRatings() {
    return this.ratingService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async createPost(
    @Body()
    {star, comment}: { star: number; comment: string },
    @Req()
    req: any,
  ) {
    return this.ratingService.create(star, comment, req.user);
  }
}
