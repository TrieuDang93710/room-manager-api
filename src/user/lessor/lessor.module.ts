/* eslint-disable prettier/prettier */

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LessorSchema } from "../schemas/lessor.schema";
import { LessorService } from "./lessor.service";
import { LessorController } from "./lessor.controller";
import { UserModule } from "../user.module";
import { TenantSchema } from "../schemas/tenant.schema";
import { UserSchema } from "../schemas/user.schema";


@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([
            { name: 'Lessor', schema: LessorSchema },
            { name: 'Tenant', schema: TenantSchema },
            { name: 'User', schema: UserSchema }
        ])
    ],
    providers: [LessorService],
    controllers: [LessorController]
})
export class LessorModule { }