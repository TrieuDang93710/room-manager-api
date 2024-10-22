/* eslint-disable prettier/prettier */

import { IsOptional } from "class-validator"

export class UpdateContractDto {

    @IsOptional()
    name: string

    @IsOptional()
    contract: string

    @IsOptional()
    contractStart: Date

    @IsOptional()
    contractTerm: Date

    @IsOptional()
    people: string

    @IsOptional()
    phone: string

    @IsOptional()
    deposit: string

    @IsOptional()
    pay: string

    @IsOptional()
    status: boolean

    @IsOptional()
    tenantBy: string

    @IsOptional()
    roomId: string

    @IsOptional()
    createBy: string
}