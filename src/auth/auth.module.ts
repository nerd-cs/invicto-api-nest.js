import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { SessionSerializer } from './session/session.serializer';
import { GoogleOauthStrategy } from './strategy/google-oauth.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    GoogleOauthStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
