/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CloudinaryController } from './cloudinary.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      // storage: diskStorage({
      //   destination: './uploads',
      //   filename: (req, file, cb) => {
      //     cb(null, `${Date.now()}${extname(file.originalname)}`);
      //   },
      // }),
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  ],
  providers: [CloudinaryService],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
