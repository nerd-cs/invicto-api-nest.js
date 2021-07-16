import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role, TypeRole } from '../roles/roles.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

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
}
