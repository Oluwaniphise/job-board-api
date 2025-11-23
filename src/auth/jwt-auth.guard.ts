import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * A custom Guard that applies the 'jwt' strategy.
 * Any controller endpoint decorated with @UseGuards(JwtAuthGuard)
 * will require a valid JWT token in the Authorization header.
 * * If validation fails (token missing, expired, or invalid secret),
 * it automatically returns a 401 Unauthorized response.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
