import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KEY_PERMISSIONS } from '../decorator/permissions-auth.decorator';
import { TypePermission } from '../../permission/permission.model';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.isAuthenticated() || !request.user) {
      throw new UnauthorizedException();
    }

    const requiredPermissions = this.reflector.getAllAndOverride<
      TypePermission[]
    >(KEY_PERMISSIONS, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const user = request.user;

    if (user.permissions?.includes(TypePermission.ALL_ACCESS)) {
      return true;
    }

    return user.permissions?.some((permission) =>
      requiredPermissions.includes(permission),
    );
  }
}
