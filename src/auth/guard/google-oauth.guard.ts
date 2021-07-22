import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EntityNotFoundException } from '../../exception/entity-not-found.exception';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err) {
      if (err instanceof EntityNotFoundException) {
        throw new UnauthorizedException('Associated account does not exist');
      }

      throw new HttpException(err, err['status'] || 500);
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const result = (await super.canActivate(context)) as boolean;

    if (result) {
      await super.logIn(context.switchToHttp().getRequest());
    }

    return result;
  }
}
