/* eslint-disable prettier/prettier */

import { IsString } from 'class-validator';

export class CreateRequirementDto {
  @IsString()
  description: string;
}
