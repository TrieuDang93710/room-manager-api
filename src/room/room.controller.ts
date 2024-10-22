/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../user/guards/role.guard';
import { Roles } from '../user/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { UpdateRoomDto } from './dto/update.dto';
import { RatingPostDto } from './dto/rating.dto';
import { Tenant } from 'src/user/schemas/tenant.schema';
@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService
    ) { }

    @Post()
    @Roles(Role.LESSOR, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async createRoom(
        @Body()
        createRoomDto: CreateRoomDto,
        @Req()
        req: any
    ): Promise<Room> {
        createRoomDto.createBy = req.user._id
        return this.roomService.create(createRoomDto, req.user)
    }

    @Put('/:id')
    @Roles(Role.LESSOR, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async updateRoomById(
        @Param('id')
        id: string,
        @Body()
        updateRoomDto: UpdateRoomDto
    ): Promise<Room> {
        return this.roomService.updateById(id, updateRoomDto)
    }

    @Delete('/:id')
    @Roles(Role.LESSOR, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async deleteRoomById(
        @Param('id')
        id: string
    ): Promise<Room> {
        return this.roomService.deleteById(id)
    }

    @Get()
    async getRooms(
        @Query()
        query: ExpressQuery
    ): Promise<Room[]> {
        return this.roomService.findAll(query)
    }

    @Get('/:id')
    async getRoom(
        @Param('id')
        id: string
    ): Promise<Room> {
        return this.roomService.findById(id)
    }

    @Post('/create-rating')
    @Roles(Role.TENANT, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async createRating(
        @Body()
        rating: RatingPostDto,
        @Req()
        req: any
    ): Promise<Room> {
        return this.roomService.rating(rating, req.user)
    }

    @Put('/:id/add-to-wishlist')
    @Roles(Role.TENANT, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async addToWishlist(
        @Req()
        req: any,
        @Param('id')
        id: string
    ): Promise<Tenant> {
        return this.roomService.addToWishlist(id, req.user)
    }

    @Put('/:id/save')
    @Roles(Role.TENANT, Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async saves(
        @Req()
        req: any,
        @Param('id')
        id: string
    ): Promise<Tenant> {
        return this.roomService.saves(id, req.user)
    }

    @Post('/follower')
    @Roles(Role.ADMIN, Role.TENANT)
    @UseGuards(AuthGuard(), RolesGuard)
    async follower(
        @Body('id')
        id: string,
        @Req()
        req: any
    ): Promise<Tenant> {
        return this.roomService.follower(id, req.user)
    }
}
