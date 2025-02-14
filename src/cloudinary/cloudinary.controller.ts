/* eslint-disable prettier/prettier */
import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('online')
  @UseInterceptors(FileInterceptor('file'))
  async online(@UploadedFile() file: Express.Multer.File) {
    return await this.cloudinaryService
      .uploadImage(file)
      .then((data) => {
        return {
          statusCode: HttpStatus.OK,
          data: data.secure_url,
        };
      })
      .catch((error) => {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        };
      });
  }
}
