/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../user/jwt.strategy';
import { RefreshTokenService } from '../helpers/refreshToken';
import { GenerateTokenService } from '../helpers/token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AddressEntity } from '../address/entities/address.entity';
import { ApplicantEntity } from '../user/entities/applicant.entity';
import { ManagerEntity } from '../user/entities/manager.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      AddressEntity,
      ApplicantEntity,
      ManagerEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RefreshTokenService,
    GenerateTokenService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
