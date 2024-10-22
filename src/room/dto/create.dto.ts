/* eslint-disable prettier/prettier */
import { IsArray, IsBoolean, IsString } from "class-validator"


export class CreateRoomDto {

    @IsString()
    readonly name: string

    @IsString()
    readonly description: string

    @IsString()
    readonly address: string

    @IsString()
    readonly price: string

    @IsBoolean()
    readonly status: false

    @IsString()
    readonly numOfRoom: string

    @IsArray()
    readonly images: []

    @IsString()
    readonly video: string

    @IsArray()
    readonly rentPerRoom: []

    @IsString()
    readonly typeOfRoom: string

    @IsBoolean()
    readonly hidden: false

    @IsBoolean()
    readonly approved: false

    @IsBoolean()
    readonly removed: false

    @IsArray()
    readonly ratings: [{
        star: 0,
        comment: '',
        postId: string
    }]

    @IsArray()
    readonly totalRating: number

    @IsArray()
    readonly requires: []

    @IsString()
    createBy: string

}