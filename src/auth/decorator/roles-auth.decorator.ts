import { TypeRole } from '../../roles/roles.model';
import { SetMetadata } from '@nestjs/common';

export const KEY_ROLES = 'roles';

export const Roles = (...roles: TypeRole[]) =>
  SetMetadata(
    KEY_ROLES,
    roles.map((roleId) => TypeRole[roleId]),
  );
