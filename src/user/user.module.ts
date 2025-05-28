/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenService } from '../helpers/refreshToken';
import { GenerateTokenService } from '../helpers/token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ApplicantEntity } from './entities/applicant.entity';
import { ManagerEntity } from './entities/manager.entity';
import { AddressEntity } from '../address/entities/address.entity';
import { PostEntity } from '../posts/entities/post.entity';
import { RequireEntity } from '../requires/entities/require.entity';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { ApplyEntity } from '../apply/entities/apply.entity';
import { ResumeEntity } from '../resume/entities/resume.entity';

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
      PostEntity,
      ApplyEntity,
      ResumeEntity,
      PaymentEntity,
      RequireEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    RefreshTokenService,
    GenerateTokenService,
    ApplicantEntity,
    ManagerEntity,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule {}
