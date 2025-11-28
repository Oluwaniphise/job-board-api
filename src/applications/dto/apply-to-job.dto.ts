import { IsOptional, IsString } from 'class-validator';

export class ApplyToJobDto {
  @IsOptional()
  @IsString()
  coverLetterText?: string;

  @IsOptional()
  @IsString()
  resumeUrl?: string;
}
