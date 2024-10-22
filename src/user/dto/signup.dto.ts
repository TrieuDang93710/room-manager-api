/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    readonly username: string

    @IsString()
    readonly avatar: string

    @IsNotEmpty()
    @IsString()
    readonly password: string

    @IsNotEmpty()
    @IsString()
    readonly email: string

    @IsString()
    readonly phoneNumber: string

    @IsBoolean()
    readonly blocked: false

    @IsString()
    readonly role: string[]

    @IsString()
    readonly token: string

    @IsString()
    readonly address: string

    @IsString()
    readonly tenant: string

    @IsString()
    readonly lessor: string

}