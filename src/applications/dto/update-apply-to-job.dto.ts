import { PartialType } from '@nestjs/mapped-types';
import { ApplyToJobDto } from './apply-to-job.dto';

export class UpdateApplyToJobDto extends PartialType(ApplyToJobDto) {}
