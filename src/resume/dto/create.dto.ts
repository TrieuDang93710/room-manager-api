/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';

export class CreateResumeDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly image: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly cv: string;

  @IsString()
  readonly education: string;

  @IsString()
  readonly level: string;

  @IsOptional()
  readonly experiences: object;

  @IsOptional()
  readonly certificates: object;

  @IsOptional()
  readonly awards: object;

  @IsOptional()
  readonly skills: object;

  @IsOptional()
  readonly languages: object;
}
