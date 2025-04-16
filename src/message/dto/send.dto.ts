/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class SendDto {
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @IsNotEmpty()
  @IsString()
  readonly image: string;
}
