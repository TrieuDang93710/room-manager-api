/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { NewsService } from './news.service';
import { Roles } from '../user/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/guards/role.guard';
import { Role } from '../shared/enums/role.enum';
import { CreateNewsDto } from './dto/create.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNewses(
    @Query()
    query: ExpressQuery,
  ) {
    return this.newsService.findAll(query);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async createNews(
    @Body()
    newsDto: CreateNewsDto,
  ) {
    return this.newsService.create(newsDto);
  }

  @Get('/:id')
  async getById(
    @Param('id')
    id: number,
  ) {
    return this.newsService.findById(id);
  }

  @Patch('/remove/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  async removeNews(
    @Param('id')
    id: number,
  ) {
    return this.newsService.remove(id);
  }
}
