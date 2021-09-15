import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role, TypeRole } from '../roles/roles.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Card } from '../card/card.model';
import { Token } from '../token/token.model';
import { UserAccessGroup } from '../user-access-group/user-access-group.model';
import { UserCompany } from '../user-company/user-company.model';
import { Company } from '../company/company.model';

export enum TypeUserStatus {
  PENDING = 'PENDING',
  INCOMPLETE = 'INCOMPLETE',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiModelProperty()
  id: number;

  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  @ApiModelProperty()
  fullName: string;

  @Column({ name: 'phone_number', type: 'varchar', nullable: true })
  @ApiModelProperty()
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  @ApiModelProperty()
  email: string;

  @Column({
    name: 'employee_number',
    type: 'int',
    nullable: true,
  })
  employeeNumber: number;

  @Column({ name: 'profile_picture', type: 'bytea', nullable: true })
  @ApiModelProperty({ type: 'string', required: false })
  profilePicture: Buffer;

  @Column({ name: 'job_title', type: 'varchar', nullable: true })
  @ApiModelProperty({ required: false })
  jobTitle: string;

  @Column('varchar', { name: 'department', nullable: true })
  @ApiModelProperty({ required: false })
  department: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiModelProperty({ required: false })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiModelProperty({ required: false })
  country: string;

  @Column({ name: 'allow_sso', type: 'boolean', default: false })
  @ApiModelProperty({ required: false })
  allowSso: boolean;

  @Column({
    type: 'enum',
    enumName: 'TypeUserStatus',
    enum: TypeUserStatus,
    nullable: true,
  })
  @ApiProperty({ enumName: 'TypeUserStatus', enum: TypeUserStatus })
  status: TypeUserStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.updatedUsers)
  @JoinColumn([{ name: 'updated_by', referencedColumnName: 'id' }])
  updatedBy: User;

  @OneToMany(() => User, (users) => users.updatedBy, { onDelete: 'SET NULL' })
  updatedUsers: User[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  @ApiProperty({ isArray: true, enumName: 'TypeRole', enum: TypeRole })
  roles: Role[];

  @OneToMany(() => Card, (card) => card.user, { cascade: true })
  cards: Card[];

  @OneToMany(() => UserAccessGroup, (userAccessGroup) => userAccessGroup.user, {
    cascade: true,
  })
  accessGroups: UserAccessGroup[];

  @OneToMany(() => UserCompany, (userCompany) => userCompany.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  companies: UserCompany[];

  @ApiModelProperty()
  lastActivity: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @ApiModelProperty()
  twoStepAuth = false;

  @ApiModelProperty()
  permissions: string[] | string;

  @ApiModelProperty()
  company: Company;
}
