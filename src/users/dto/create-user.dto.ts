import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsIn,
} from 'class-validator';
import type { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Candidate', 'Employer'])
  role: UserRole;
}
