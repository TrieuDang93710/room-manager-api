/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class UpdateFieldDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;
}