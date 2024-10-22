/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt'
import { Address } from '../address/schemas/address.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Tenant } from './schemas/tenant.schema';
import { Lessor } from './schemas/lessor.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService,
        @InjectModel(Address.name)
        private addressModel: mongoose.Model<Address>,
        @InjectModel(Tenant.name)
        private tenantModel: mongoose.Model<Tenant>,
        @InjectModel(Lessor.name)
        private lessorModel: mongoose.Model<Lessor>
    ) { }

    async signup(signUpDto: SignUpDto): Promise<{ token: string }> {
        const { username, password, email, address, role, tenant, lessor } = signUpDto
        const salt = 10
        const hashPassword = await bcrypt.hash(password, salt)

        if (address) {
            const newAddress = await this.addressModel.create(address)

            let newTenant;
            let newLessor;

            for (let index = 0; index < role.length; index++) {
                const element = role[index];
                if (element === 'tenant') {
                    newTenant = await this.tenantModel.create(tenant)
                    const newUser = await this.userModel.create({
                        username,
                        password: hashPassword,
                        email,
                        role,
                        address: newAddress,
                        // tenant: newTenant,
                        tenant: newTenant,
                    })
                    if (newTenant.userId) {
                        throw new Error('User id is already existed.')
                    }
                    await newTenant.updateOne({
                        $push: {
                            userId: newUser._id
                        }
                    })
                    const token = await this.jwtService.sign({ id: newUser._id })
                    return { token }
                }
                if (element === 'lessor') {
                    newLessor = await this.lessorModel.create(lessor)

                    const newUser = await this.userModel.create({
                        username,
                        password: hashPassword,
                        email,
                        role,
                        address: newAddress,
                        lessor: newLessor
                    })

                    const token = await this.jwtService.sign({ id: newUser._id })
                    return { token }
                }
                if (element === 'admin') {
                    const newUser = await this.userModel.create({
                        username,
                        password: hashPassword,
                        email,
                        role,
                        address: newAddress,
                    })

                    const token = await this.jwtService.sign({ id: newUser._id })
                    return { token }
                }
            }
        }

        const newUser = await this.userModel.create({
            username,
            password: hashPassword,
            email,
            role
        })

        const token = await this.jwtService.sign({ id: newUser._id })


        return { token }
    }

    async login(
        loginDto: LoginDto,
    ): Promise<{ token: string }> {
        const { email, password } = loginDto

        const user = await this.userModel.findOne({ email })

        if (!user) {
            throw new UnauthorizedException('Invalid email or password.')
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid email or password.')
        }

        const token = this.jwtService.sign({ id: user._id })

        if (user && isPasswordMatch) {
            // const token = await this.jwtService.sign({ id: user._id })
            const updateUser = await this.userModel.findByIdAndUpdate(
                user._id,
                {
                    token: token
                },
                {
                    new: true
                }
            )
            updateUser.save()
        }

        // res.cookie('refreshToken', token, {
        //     httpOnly: true,
        //     maxAge: 72 * 60 * 60 * 1000
        // })

        return { token }
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find()
            .populate('tenant')
            .populate('lessor')
            .populate('address')
    }

    async findById(id: string): Promise<User> {
        return this.userModel.findById(id).populate('address')
    }

    async findUserByEmail(email: string): Promise<User> {
        return this.userModel.findOne({ email: email })
    }

    async findAllTenants(): Promise<Tenant[]> {
        return this.tenantModel.find()
    }
}
