/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendDto {
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @IsOptional()
  readonly image: string;
}
