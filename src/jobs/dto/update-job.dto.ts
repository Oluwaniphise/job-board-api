import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsString()
  // We remove the employerId from the update DTO, the ID shouldn't be changed.
  employerId: never;
}
