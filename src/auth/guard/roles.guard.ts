import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KEY_ROLES } from '../decorator/roles-auth.decorator';
import { TypeRole } from '../../roles/roles.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated() || !request.user) {
      throw new UnauthorizedException();
    }

    const requiredRoles = this.reflector.getAllAndOverride<TypeRole[]>(
      KEY_ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const user = request.user;

    return user.roles?.some((role) => requiredRoles.includes(role));
  }
}
