/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async refreshToken(
    userId: number,
    username: string,
    role: string,
  ): Promise<{ refreshToken: string }> {
    const refreshToken = this.jwtService.sign(
      { id: userId, username: username, role: role },
      { expiresIn: '7d' },
    );

    const user = await this.userRepository.findOne({ where: { id: userId } });
    // const salt = 10;

    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    await this.userRepository.update(userId, {
      refresh_token: refreshToken,
      // refresh_token: await bcrypt.hash(refreshToken, salt),
    });

    return { refreshToken };
  }
}
