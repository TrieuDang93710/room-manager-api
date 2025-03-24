/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';

export class ApprovePostDto {
  @IsOptional()
  readonly status: string[];
}
