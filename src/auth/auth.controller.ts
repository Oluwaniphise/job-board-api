import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express'; // Import types for request and response

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /auth/google - Initiates the Google OAuth 2.0 login flow.
   * * @UseGuards(AuthGuard('google')) middleware immediately intercepts the request
   * and redirects the client browser to Google's consent screen.
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {}

  /**
   * GET /auth/google/callback - Receives the user back from Google.
   * * 1. AuthGuard('google') runs the GoogleStrategy to authenticate the user.
   * 2. The strategy runs the AuthService.validateSocialUser() logic (create/login).
   * 3. The strategy attaches the authenticated user object (with the JWT) to req.user.
   * 4. We then manually redirect the client to the frontend.
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { accessToken, user } = req.user as any;

    // Final Step: Redirect the user back to the Next.js frontend.
    // The frontend extracts the token and user info from the query parameters.
    const frontendRedirectUrl = `http://localhost:3000/dashboard?token=${accessToken}&userId=${user._id}&role=${user.role}`;

    // Use the express response object to handle the redirect
    res.redirect(frontendRedirectUrl);
  }
}
