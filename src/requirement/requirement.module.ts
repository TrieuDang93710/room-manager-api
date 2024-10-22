/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { RequirementController } from "./requirement.controller";
import { RequirementService } from "./requirement.service";
import { MongooseModule } from "@nestjs/mongoose";
import { RequirementSchema } from "./schemas/requirement.schema";
import { UserSchema } from "src/user/schemas/user.schema";
import { TenantSchema } from "src/user/schemas/tenant.schema";
import { RoomSchema } from "src/room/schemas/room.schema";
import { UserModule } from "src/user/user.module";


@Module({
    imports: [
        UserModule,
        MongooseModule.forFeature([
            { name: 'Requirement', schema: RequirementSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Tenant', schema: TenantSchema },
            { name: 'Room', schema: RoomSchema }
        ])
    ],
    providers: [RequirementService],
    controllers: [RequirementController]
})

export class RequirementModule { }