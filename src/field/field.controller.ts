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
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateFieldDto } from './dto/create.dto';
import { UpdateFieldDto } from './dto/update.dto';
import { FieldService } from './field.service';

@Controller('field')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Post()
  async createField(
    @Body()
    createFieldDto: CreateFieldDto,
  ) {
    return this.fieldService.create(createFieldDto);
  }

  @Get()
  async getCategories(
    @Query()
    query: ExpressQuery,
  ) {
    return this.fieldService.findAll(query);
  }

  @Get('/:id')
  async getFieldById(@Param('id') id: number) {
    return this.fieldService.findById(id);
  }

  @Patch('/:id')
  async updateFieldById(
    @Param('id') id: number,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldService.updateById(id, updateFieldDto);
  }

  @Delete('/:id')
  async deleteFieldById(@Param('id') id: number) {
    return this.fieldService.deleteById(id);
  }
}
