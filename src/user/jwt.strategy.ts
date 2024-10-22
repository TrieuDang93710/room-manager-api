/* eslint-disable prettier/prettier */

import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import mongoose from "mongoose"
import { User } from "./schemas/user.schema"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name)
        private userSchema: mongoose.Model<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: any) {
        const { id } = payload

        const user = await this.userSchema.findById(id)

        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint.')
        }

        return user
    }
}