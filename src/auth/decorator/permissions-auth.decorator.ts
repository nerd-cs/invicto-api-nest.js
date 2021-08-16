import { SetMetadata } from '@nestjs/common';
import { TypePermission } from '../../permission/permission.model';

export const KEY_PERMISSIONS = 'permissions';
export const Permissions = (...permissions: TypePermission[]) =>
  SetMetadata(
    KEY_PERMISSIONS,
    permissions.map((permissionId) => TypePermission[permissionId]),
  );
