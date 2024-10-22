/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from '../shared/enums/role.enum';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('/signup')
    async signUp(
        @Body()
        signUpDto: SignUpDto
    ): Promise<{ token: string }> {
        return this.userService.signup(signUpDto)
    }

    @Post('/login')
    async login(
        @Body()
        loginDto: LoginDto,
    ): Promise<{ token: string }> {
        return this.userService.login(loginDto)
    }

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    async getUsers(): Promise<User[]> {
        return this.userService.findAll()
    }

    @Get('/:id')
    async getUserById(
        @Param('id')
        id: string
    ): Promise<User> {
        return this.userService.findById(id)
    }

    // Role of user
    // role of user is tenant

    // Role of user
    // role of user is lessor

}
