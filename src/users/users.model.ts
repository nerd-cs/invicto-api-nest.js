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
import { Company } from '../company/company.model';
import { AccessGroup } from '../access-group/access-group.model';
import { Token } from '../token/token.model';

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

  @Column({ name: 'phone_number', type: 'varchar', nullable: false })
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
  jobTitle: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true })
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

  @ManyToMany(() => AccessGroup, (accessGroup) => accessGroup.users)
  @ApiModelProperty({ isArray: true, type: 'string' })
  accessGroups: AccessGroup[];

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  @ApiModelProperty()
  company: Company;

  @ApiModelProperty()
  lastActivity: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
