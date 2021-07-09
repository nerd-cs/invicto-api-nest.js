import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.model';

export enum TypeRole {
  'GUEST',
  'MEMBER',
  'TIER_ADMIN',
  'ADMIN',
}

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enumName: 'TYPE_ROLE', unique: true })
  value: TypeRole;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
