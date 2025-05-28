/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenerateTokenService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async token(
    userId: number,
    username: string,
    role: string,
  ): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    // const salt = 10;

    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    const token = this.jwtService.sign({
      id: userId,
      username: username,
      role: role,
    });

    await this.userRepository.update(userId, {
      // token: await bcrypt.hash(token, salt),
      token: token,
    });

    return { token };
  }
}
