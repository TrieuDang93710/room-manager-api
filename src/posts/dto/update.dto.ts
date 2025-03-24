/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly work_type: string[];

  @IsOptional()
  readonly duration: Date;
}
