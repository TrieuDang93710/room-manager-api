/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';
export class StatusDto {
  @IsOptional()
  readonly status: string[];
}
