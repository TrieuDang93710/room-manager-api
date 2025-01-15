/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class GenerateTokenService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async token(
    userId: string,
    username: string,
    role: string,
  ): Promise<{ token: string }> {
    const user = await this.userModel.findById(userId);
    const salt = 10;

    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    const token = this.jwtService.sign({
      id: userId,
      username: username,
      role: role,
    });

    const updateUser = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        token: await bcrypt.hash(token, salt),
      },
      {
        new: true,
      },
    );
    updateUser.save();

    return { token };
  }
}
