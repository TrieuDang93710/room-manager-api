/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator"

export class LoginDto {

    @IsNotEmpty()
    @IsEmail({}, {message: 'Please, enter correct email.'})
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(6, {message: 'Please, enter password include 6 char.'})
    readonly password: string
}