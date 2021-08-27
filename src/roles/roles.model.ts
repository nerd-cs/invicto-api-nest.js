import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '../permission/permission.model';
import { User } from '../users/users.model';

export enum TypeRole {
  GUEST = 'GUEST',
  MEMBER = 'MEMBER',
  SECURITY = 'SECURITY',
  USER_MANAGER = 'USER_MANAGER',
  FRONT_DESK = 'FRONT_DESK',
  ADMIN = 'ADMIN',
}
@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enumName: 'TYPE_ROLE', unique: true })
  value: TypeRole;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];
}
