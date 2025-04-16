/* eslint-disable prettier/prettier */

import { IsEmpty, IsOptional } from 'class-validator';

export class ApiResponseDto<T> {
  @IsEmpty()
  @IsOptional()
  statusCode?: number;

  @IsEmpty()
  @IsOptional()
  message?: string;

  @IsOptional()
  data?: T;
}
