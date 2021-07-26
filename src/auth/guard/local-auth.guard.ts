import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityNotFoundException } from '../../exception/entity-not-found.exception';
import { BadCredentialsException } from '../../exception/bad-credentials.exception';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err || !user) {
      if (
        err instanceof EntityNotFoundException ||
        err instanceof BadCredentialsException
      ) {
        throw new UnauthorizedException('Invalid email or password');
      } else {
        throw err;
      }
    }

    return user;
  }

  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);

    return result;
  }
}
