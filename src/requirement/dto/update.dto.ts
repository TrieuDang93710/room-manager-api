/* eslint-disable prettier/prettier */

import { IsOptional } from "class-validator"

export class UpdateRequirementDto {

    @IsOptional()
    status: false

    @IsOptional()
    description: string

    @IsOptional()
    roomId: string

    @IsOptional()
    createBy: string

}