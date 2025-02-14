/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { id } = payload;

    const user = await this.userRepository.findOneBy({ id: id });
    console.log('user: ', user);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    if (user.active === false) {
      throw new BadRequestException('Account must be activation');
    }

    return user;
  }
}
