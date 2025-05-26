/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { ApplicantModule } from './user/applicant/applicant.module';
import { LessorModule } from './user/lessor/lessor.module';
import { PostModule } from './posts/post.module';
import { CategoryModule } from './category/category.module';
import { ResumeModule } from './resume/resume.module';
import { RequireModule } from './requires/require.module';
import { MailModule } from './mail/mailer.module';
import { AuthModule } from './auth/auth.module';
import { dataSourceOptions } from 'db/data-source';
import { RatingModule } from './rating/rating.module';
import { MessageModule } from './message/message.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SalaryModule } from './salary/salary.module';
import { PaymentModule } from './payment/payment.module';
import { WorkPlaceModule } from './work_place/work_place.module';
import { CompanyModule } from './company/company.module';
import { ApplyModule } from './apply/apply.module';
import { ServicePackageModule } from './service_package/service_package.module';
import { NewsModule } from './news/news.module';
import { FieldModule } from './field/field.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // MongooseModule.forRoot(process.env.MONGODB_URL),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    AddressModule,
    ApplicantModule,
    LessorModule,
    PostModule,
    CategoryModule,
    ResumeModule,
    ApplyModule,
    PaymentModule,
    RequireModule,
    MailModule,
    RatingModule,
    MailerModule,
    MessageModule,
    CloudinaryModule,
    SalaryModule,
    ServicePackageModule,
    WorkPlaceModule,
    CompanyModule,
    NewsModule,
    FieldModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
