/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async refreshToken(
    userId: string,
    username: string,
    role: string,
  ): Promise<{ refreshToken: string }> {
    const refreshToken = this.jwtService.sign(
      { id: userId, username: username, role: role },
      { expiresIn: '7d' },
    );

    const user = await this.userModel.findById(userId);
    const salt = 10;

    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    const updateUser = await this.userModel.findByIdAndUpdate(
      user._id,
      {
        refresh_token: await bcrypt.hash(refreshToken, salt),
      },
      {
        new: true,
      },
    );
    updateUser.save();

    return { refreshToken };
  }
}
