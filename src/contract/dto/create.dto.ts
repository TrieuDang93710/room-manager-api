/* eslint-disable prettier/prettier */

import { IsBoolean, IsDate, IsString } from "class-validator"

export class CreateContractDto {

    @IsString()
    name: string

    @IsString()
    contract: string

    @IsDate()
    contractStart: Date

    @IsDate()
    contractTerm: Date

    @IsString()
    people: string

    @IsString()
    phone: string

    @IsString()
    deposit: string

    @IsString()
    pay: string

    @IsBoolean()
    status: boolean

    @IsString()
    tenantBy: string

    @IsString()
    roomId: string

    @IsString()
    createBy: string
}