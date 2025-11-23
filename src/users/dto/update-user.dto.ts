import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';
import type { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  password?: never;

  @IsOptional()
  @IsString()
  @IsIn(['Candidate', 'Employer'])
  role?: UserRole;
}
