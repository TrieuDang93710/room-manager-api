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
import { CreatePostDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/guards/role.guard';
import { Roles } from '../user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { UpdateRoomDto } from './dto/update.dto';
import { RatingPostDto } from './dto/rating.dto';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { PostService } from './post.service';
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER, Role.MANAGER)
  @UseGuards(AuthGuard(), RolesGuard)
  async createPost(
    @Body()
    createPostDto: CreatePostDto,
    @Req()
    req: any,
  ) {
    createPostDto.createBy = req.user._id;
    return this.postService.create(createPostDto, req.user);
  }

  @Put('/:id')
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async updateRoomById(
    @Param('id')
    id: number,
    @Body()
    updateRoomDto: UpdateRoomDto,
  ) {
    return this.postService.updateById(id, updateRoomDto);
  }

  @Delete('/:id')
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async deleteRoomById(
    @Param('id')
    id: number,
  ) {
    return this.postService.deleteById(id);
  }

  @Get()
  async getPosts(
    @Query()
    query: ExpressQuery,
  ) {
    return this.postService.findAll(query);
  }

  @Get('/:id')
  async getPost(
    @Param('id')
    id: number,
  ) {
    return this.postService.findById(id);
  }

  @Post('/create-rating')
  @Roles(Role.TENANT, Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async createRating(
    @Body()
    rating: RatingPostDto,
    @Req()
    req: any,
  ) {
    return this.postService.rating(rating, req.user);
  }

  @Put('/add-to-wishlist/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async addToWishlist(
    @Req()
    req: any,
    @Param('id')
    id: number,
  ): Promise<ApplicantEntity> {
    return this.postService.addToWishlist(id, req.user);
  }

  @Put('/save/:id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async saves(
    @Req()
    req: any,
    @Param('id')
    id: number,
  ): Promise<ApplicantEntity> {
    return this.postService.saves(id, req.user);
  }

  @Put('/follower/:id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  async follower(
    @Param('id')
    id: number,
    @Req()
    req: any,
  ): Promise<ApplicantEntity> {
    return this.postService.follower(id, req.user);
  }
}
