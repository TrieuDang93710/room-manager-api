/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { AddressSchema } from 'src/address/schemas/address.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { TenantSchema } from './schemas/tenant.schema';
import { LessorSchema } from './schemas/lessor.schema';
import { RoomSchema } from 'src/room/schemas/room.schema';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES')
          }
        }
      }
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Address', schema: AddressSchema },
      { name: 'Tenant', schema: TenantSchema },
      { name: 'Lessor', schema: LessorSchema },
      { name: 'Room', schema: RoomSchema }
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class UserModule { }
