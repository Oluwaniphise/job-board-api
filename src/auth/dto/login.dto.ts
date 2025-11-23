import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for handling user login credentials.
 * This class validates the structure of the request body for the POST /auth/login endpoint.
 */
export class LoginDto {
  /**
   * Must be a valid email format and must not be empty.
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Must not be empty and must be at least 8 characters long (matching our registration rule).
   */
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
