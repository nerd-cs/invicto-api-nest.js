import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../roles/roles.model';

export enum TypePermission {
  BUILDING_ACCESS = 'BUILDING_ACCESS',
  ACCOUNT_MANAGEMENT = 'ACCOUNT_MANAGEMENT',
  CARD_REQUEST = 'CARD_REQUEST',
  READ_ACTIVITY = 'READ_ACTIVITY',
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  KEY_MANAGEMENT = 'KEY_MANAGEMENT',
  ALL_ACCESS = 'ALL_ACCESS',
  COMPANY_MANAGEMENT = 'COMPANY_MANAGEMENT',
  ACCESS_CONTROL_MANAGEMENT = 'ACCESS_CONTROL_MANAGEMENT',
  HARDWARE_MANAGEMENT = 'HARDWARE_MANAGEMENT',
  ACTIVITY_MANAGEMENT = 'ACTIVITY_MANAGEMENT',
}
@Entity('role_permission')
export class Permission {
  @Column('integer', { primary: true, name: 'role_id' })
  roleId: number;

  @Column('enum', {
    primary: true,
    name: 'permission',
    enum: TypePermission,
  })
  permission: TypePermission;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;
}
