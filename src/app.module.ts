/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { TenantModule } from './user/tenant/tenant.module';
import { LessorModule } from './user/lessor/lessor.module';
import { RoomModule } from './room/room.module';
import { CategoryModule } from './category/category.module';
import { ContractModule } from './contract/contract.module';
import { PaymentModule } from './contract/payment/payment.module';
import { RequirementModule } from './requirement/requirement.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mailer.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'sa123',
    //   database: 'typeorm-room-manager-db',
    //   entities: [],
    //   synchronize: true,
    // }),
    UserModule,
    AddressModule,
    TenantModule,
    LessorModule,
    RoomModule,
    CategoryModule,
    ContractModule,
    PaymentModule,
    RequirementModule,
    MailModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: process.env.MAILDEV_INCOMING_HOST,
          port: parseInt(process.env.MAILDEV_INCOMING_PASS),
          // ignoreTLS: true,
          secure: false,
          auth: {
            user: process.env.MAILDEV_INCOMING_USER,
            pass: process.env.MAILDEV_INCOMING_PASS,
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
