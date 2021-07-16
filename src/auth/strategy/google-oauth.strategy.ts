import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${GoogleOauthStrategy.constructAppUrl()}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;
    const email = emails.filter((email) => email.verified)[0].value;
    const user = await this.authService.validateOauthUser(email);
    user.fullName = displayName;
    user.profilePicture = photos[0].value;
    user['accessToken'] = accessToken;
    user['refreshToken'] = refreshToken;

    done(null, user);
  }

  private static constructAppUrl(): string {
    return (
      process.env.APP_URL ||
      `http://${process.env.SERVER_HOST}:${process.env.PORT}`
    );
  }
}
