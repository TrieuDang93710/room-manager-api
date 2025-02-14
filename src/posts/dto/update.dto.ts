/* eslint-disable prettier/prettier */
import { IsOptional } from "class-validator"


export class UpdateRoomDto {

    @IsOptional()
    readonly name: string

    @IsOptional()
    readonly description: string

    @IsOptional()
    readonly address: string

    @IsOptional()
    readonly price: string

    @IsOptional()
    readonly status: false

    @IsOptional()
    readonly numOfRoom: string

    @IsOptional()
    readonly images: []

    @IsOptional()
    readonly video: string

    @IsOptional()
    readonly rentPerRoom: []

    @IsOptional()
    readonly typeOfRoom: string

    @IsOptional()
    readonly hidden: false

    @IsOptional()
    readonly approved: false

    @IsOptional()
    readonly removed: false

    @IsOptional()
    readonly ratings: [{
        star: 0,
        comment: '',
        postId: string
    }]

    @IsOptional()
    readonly totalRating: number

    @IsOptional()
    readonly requires: []

    @IsOptional()
    createBy: string

}