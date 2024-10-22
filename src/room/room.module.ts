/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './schemas/room.schema';
import { CategorySchema } from 'src/category/schemas/category.schema';
import { UserModule } from 'src/user/user.module';
import { UserSchema } from 'src/user/schemas/user.schema';
import { TenantSchema } from 'src/user/schemas/tenant.schema';
import { LessorSchema } from 'src/user/schemas/lessor.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'Room', schema: RoomSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'User', schema: UserSchema },
      { name: 'Tenant', schema: TenantSchema },
      { name: 'Lessor', schema: LessorSchema }
    ])
  ],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule { }
