/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ContractService } from './contract.service';
import { Contract } from './schemas/contract.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/guards/role.guard';
import { Roles } from 'src/user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { CreateContractDto } from './dto/create.dto';
import { UpdateContractDto } from './dto/update.dto';

@Controller('contract')
export class ContractController {
    constructor(
        private contractService: ContractService
    ) { }

    @Post()
    @Roles(Role.LESSOR, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async createContract(
        @Body()
        createContractDto: CreateContractDto,
        @Req()
        req: any
    ): Promise<Contract> {
        return this.contractService.create(createContractDto, req.user)
    }

    @Get()
    async getContracts(): Promise<Contract[]> {
        return this.contractService.findAll()
    }

    @Get('/:id')
    @Roles(Role.LESSOR, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async getContract(
        @Param('id')
        id: string
    ): Promise<Contract> {
        return this.contractService.findById(id)
    }

    @Put('/:id')
    @Roles(Role.LESSOR, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async updateContract(
        @Param('id')
        id: string,
        @Body()
        updateContractDto: UpdateContractDto
    ): Promise<Contract> {
        return this.contractService.updateById(id, updateContractDto)
    }
}
