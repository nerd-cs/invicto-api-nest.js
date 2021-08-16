import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../users/users.model';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { AuthService } from './auth.service';
import { UserNotFoundInterceptor } from './interceptor/user-not-found.interceptor';

const SIGN_IN_REQUEST_BODY_OPTIONS = {
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
    required: ['email', 'password'],
  },
};

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with user credentials' })
  @ApiOkResponse({ type: User, description: 'Successfully signed in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiBody(SIGN_IN_REQUEST_BODY_OPTIONS)
  login(@Req() request) {
    const { permissions, ...rest } = request.user;

    return rest;
  }

  @Get('/logout')
  @UseGuards(AuthenticatedGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Sign out' })
  @ApiOkResponse({ description: 'Successfully signed out' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  logout(@Req() req) {
    req.logout();
  }

  @Get('/google')
  @UseGuards(GoogleOauthGuard)
  @ApiExcludeEndpoint()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

  @Get('/google/redirect')
  @UseGuards(GoogleOauthGuard)
  @ApiExcludeEndpoint()
  @UseInterceptors(UserNotFoundInterceptor)
  googleRedirect(@Req() request) {
    return this.authService.processGoogleData(request.user);
  }
}
