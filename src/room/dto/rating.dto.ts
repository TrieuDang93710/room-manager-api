/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class RatingPostDto {

    @IsString()
    star: number

    @IsString()
    comment: string

    @IsString()
    roomId: string

}