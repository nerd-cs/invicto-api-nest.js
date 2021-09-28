import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '../company/company.model';
import { User } from '../users/users.model';

@Entity('department')
export class Department {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', unique: true })
  name: string;

  @Column('boolean', { name: 'is_cost_center', default: () => 'false' })
  isCostCenter: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column('integer', { name: 'company_id', unique: true })
  companyId: number;

  @ManyToOne(() => Company, (company) => company.departments)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: Company;

  @OneToMany(() => User, (user) => user.costCenter)
  costCenterUsers: User[];

  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
