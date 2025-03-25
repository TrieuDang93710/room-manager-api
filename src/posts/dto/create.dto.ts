/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly company: number;

  @IsNumber()
  readonly type_of_post: number;

  @IsOptional()
  readonly duration: Date;

  @IsOptional()
  readonly salary: string;

  @IsOptional()
  readonly benefit: string;

  @IsOptional()
  readonly require: number;
}
