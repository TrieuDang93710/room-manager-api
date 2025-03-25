/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';
export class UpdateResumeDto {
  @IsOptional()
  title: string;

  @IsOptional()
  job: string;

  @IsOptional()
  target: string;

  @IsOptional()
  image: string;

  @IsOptional()
  description: string;

  @IsOptional()
  cv: string;

  @IsOptional()
  education: string;

  @IsOptional()
  level: string;

  @IsOptional()
  experiences: object;

  @IsOptional()
  certificates: object;

  @IsOptional()
  awards: object;

  @IsOptional()
  skills: object;

  @IsOptional()
  languages: object;

  @IsOptional()
  applicant: number;
}
