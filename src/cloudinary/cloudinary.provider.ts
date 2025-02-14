/* eslint-disable prettier/prettier */
import { v2 } from 'cloudinary';
import { CLOUDINARY } from '../contants';

export const CloudinaryProvider = {
  provider: CLOUDINARY,
  useFactory: (): void => {
    v2.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};
