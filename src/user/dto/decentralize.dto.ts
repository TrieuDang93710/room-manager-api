/* eslint-disable prettier/prettier */

import { IsArray, IsNotEmpty } from 'class-validator';

export class DecentralizeDto {
  @IsNotEmpty()
  @IsArray()
  readonly role: string[];
}
