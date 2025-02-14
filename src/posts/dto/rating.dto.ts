/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';

export class RatingPostDto {
  @IsNumber()
  star: number;

  @IsString()
  comment: string;

  @IsNumber()
  roomId: number;
}
