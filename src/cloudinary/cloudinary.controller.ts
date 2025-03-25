/* eslint-disable prettier/prettier */

import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import cloudinary from 'src/cloudinary.config';
import { ApiResponseDto } from 'src/dto/response.dto';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponseDto<any>> {
    try {
      const result: any = await cloudinary.uploader.upload(file.path);
      const image_information = {
        width: result.width,
        height: result.height,
        format: result.format,
        url: result.url,
        secure_url: result.secure_url,
      };
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Upload image to cloudinary',
        data: image_information,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        data: error,
      };
    }
  }

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponseDto<any>> {
    try {
      const data = await this.cloudinaryService.uploadFile(file);
      console.log('data: ', data);
      const image_information = {
        url: data.url,
        secure_url: data.secure_url,
      };
      return {
        statusCode: HttpStatus.CREATED,
        data: image_information,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message,
      };
    }
  }
}
