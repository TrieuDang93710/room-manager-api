/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { TenantService } from "./tenant.service";
import { MongooseModule } from "@nestjs/mongoose";
import { TenantSchema } from "../schemas/tenant.schema";
import { TenantController } from "./tenant.controller";
import { UserModule } from "../user.module";
import { LessorSchema } from "../schemas/lessor.schema";
import { UserSchema } from "../schemas/user.schema";
import { ContractSchema } from "src/contract/schemas/contract.schema";


@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([
            { name: 'Tenant', schema: TenantSchema },
            { name: 'Lessor', schema: LessorSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Contract', schema: ContractSchema }
        ])
    ],
    providers: [TenantService],
    controllers: [TenantController]
})
export class TenantModule { }