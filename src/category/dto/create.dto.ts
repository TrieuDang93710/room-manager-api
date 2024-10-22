/* eslint-disable prettier/prettier */

import { IsArray, IsString } from "class-validator"


export class CreateCategoryDto {
    @IsString()
    readonly name: string

    @IsString()
    readonly slug: string

    @IsString()
    readonly description: string

    @IsArray()
    readonly rooms: []
}