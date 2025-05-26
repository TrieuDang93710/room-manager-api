/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldEntity } from './entities/field.entity';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldEntity]),
  ],
  providers: [FieldService],
  controllers: [FieldController],
})
export class FieldModule {}
