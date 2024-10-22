/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { RequirementService } from "./requirement.service";
import { Requirement } from "./schemas/requirement.schema";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/user/guards/role.guard";
import { Roles } from "src/user/decorators/role.decorator";
import { Role } from "src/shared/enums/role.enum";
import { CreateRequirementDto } from "./dto/create.dto";


@Controller('requirement')
export class RequirementController {
    constructor(
        private requirementService: RequirementService
    ) { }

    @Post()
    @Roles(Role.TENANT, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async createRequirement(
        @Body()
        createRequirementDto: CreateRequirementDto,
        @Req()
        req: any
    ): Promise<Requirement> {
        return this.requirementService.create(createRequirementDto, req.user)
    }

    @Get()
    async getRequirements(): Promise<Requirement[]> {
        return this.requirementService.findAll()
    }
}
