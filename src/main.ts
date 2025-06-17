/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://jobs-searching-system.vercel.app',
      'https://job-searching-nextjs-app-latest.onrender.com',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // const config = new DocumentBuilder()
  //   .setTitle('Jobs Searching System API')
  //   .setDescription('The jobs searching system API description')
  //   .setVersion('1.0')
  //   .addTag('jobs')
  //   .build();
  // const documentFactory = () => SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT_SERVER || 8080);
}
bootstrap();
