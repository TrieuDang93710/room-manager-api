/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import toStream from 'buffer-to-stream';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { CloudinaryProvider } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resole, reject) => {
      CloudinaryProvider.useFactory();
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resole(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }
}
