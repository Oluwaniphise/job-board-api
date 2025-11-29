import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptions,
} from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const isProd = configService.get<string>('NODE_ENV') === 'production';
    const callbackURL =
      (isProd
        ? configService.get<string>('GOOGLE_CALLBACK_URL_PROD')
        : configService.get<string>('GOOGLE_CALLBACK_URL')) ||
      configService.get<string>('GOOGLE_CALLBACK_URL');

    super({
      clientID: configService.get('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
      callbackURL: callbackURL!,
      scope: ['email', 'profile'], // Request email and profile data
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, emails } = profile;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const email = emails[0].value;

    // We delegate the logic of finding/creating the user and generating the final JWT
    const user = await this.authService.validateSocialUser(
      email,
      name.givenName,
      name.familyName,
      'Candidate', // Default role for social sign-ups
    );

    // Pass the user object back to Passport. This object will be attached to the request (req.user)
    done(null, user);
  }
}
