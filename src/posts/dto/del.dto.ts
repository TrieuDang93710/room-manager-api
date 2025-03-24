/* eslint-disable prettier/prettier */
import { IsOptional } from "class-validator";

export class DelPostDto {
    
    @IsOptional()
    readonly status: string[]
}