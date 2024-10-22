/* eslint-disable prettier/prettier */

import { IsBoolean, IsString } from "class-validator"

export class CreateRequirementDto {

    @IsBoolean()
    status: false

    @IsString()
    description: string

    @IsString()
    roomId: string

    @IsString()
    createBy: string

}