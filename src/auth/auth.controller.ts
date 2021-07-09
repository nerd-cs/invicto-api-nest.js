import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../users/users.model';

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
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with user credentials' })
  @ApiOkResponse({ type: User, description: 'Successfully signed in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiBody(SIGN_IN_REQUEST_BODY_OPTIONS)
  login(@Req() request) {
    return request.user;
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
}
