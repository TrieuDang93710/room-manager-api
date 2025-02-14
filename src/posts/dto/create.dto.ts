/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsString()
  readonly price: string;

  @IsOptional()
  @IsString()
  readonly numOfRoom: string;

  @IsOptional()
  @IsNumber()
  readonly typeOfRoom: number;

  @IsOptional()
  @IsString()
  createBy: number;
}
