/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import toStream from 'buffer-to-stream';
import cloudinary from '../cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise(async (resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      console.log('file: ', file);
      if (!file.buffer || !Buffer.isBuffer(file.buffer)) {
        return reject(new Error('file is not a valid buffer'));
      }
      const stream = toStream(file.buffer);
      stream.pipe(upload);
    });
  }
}
