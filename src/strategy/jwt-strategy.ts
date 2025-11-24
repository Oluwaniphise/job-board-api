import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/users/entities/user.entity';

export interface JwtPayload {
  email: string;
  sub: string; // User ID
  role: UserRole;
}

@Injectable()
// The 'jwt' string identifies this strategy and is used by AuthGuard('jwt')
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    // Configuration options passed to the passport-jwt library
    super({
      // 1. How to find the JWT in the request (Bearer Token in the Authorization header)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Secret key used to verify the token's signature (must match the one used to sign it)
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * This method runs ONLY after the token is successfully validated (signature and expiration checked).
   * It takes the decoded payload and attaches the user data to the request.
   * @param payload The decoded data from the JWT.
   * @returns The user data to be attached to req.user
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
