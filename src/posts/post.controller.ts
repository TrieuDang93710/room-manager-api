/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { UpdatePostDto } from './dto/update.dto';
import { ApplicantEntity } from 'src/user/entities/applicant.entity';
import { PostService } from './post.service';
import { DelPostDto } from './dto/del.dto';
import { ApprovePostDto } from './dto/approve.dto';
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
    return this.postService.create(createPostDto, req.user);
  }

  @Patch('/:id')
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER, Role.MANAGER)
  @UseGuards(AuthGuard(), RolesGuard)
  async updatePostById(
    @Param('id')
    id: number,
    @Body()
    updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updateById(id, updatePostDto);
  }

  @Patch('/delete/:id')
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER, Role.MANAGER)
  @UseGuards(AuthGuard(), RolesGuard)
  async deletePostById(
    @Param('id')
    id: number,
    @Body()
    delPostDto: DelPostDto,
  ) {
    return this.postService.removeById(id, delPostDto);
  }

  @Patch('/approve/:id')
  @Roles(Role.LESSOR, Role.ADMIN, Role.USER, Role.MANAGER)
  @UseGuards(AuthGuard(), RolesGuard)
  async approvedPostById(
    @Param('id')
    id: number,
    @Body()
    approvePostDto: ApprovePostDto,
  ) {
    return this.postService.approvedById(id, approvePostDto);
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

  @Patch('/add-to-wishlist/:id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async addToWishlist(
    @Req()
    req: any,
    @Param('id')
    id: number,
  ): Promise<ApplicantEntity> {
    return this.postService.addToWishlist(id, req.user);
  }

  @Patch('/save/:id')
  @Roles(Role.ADMIN, Role.USER, Role.APPLICANT)
  @UseGuards(AuthGuard(), RolesGuard)
  async saves(
    @Req()
    req: any,
    @Param('id')
    id: number,
  ): Promise<ApplicantEntity> {
    return this.postService.saves(id, req.user);
  }
}
