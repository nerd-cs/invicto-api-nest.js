import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from '../company/company.model';
import { User } from '../users/users.model';

@Entity('user_company')
export class UserCompany {
  @Column('integer', { primary: true, name: 'user_id' })
  userId: number;

  @Column('integer', { primary: true, name: 'company_id' })
  companyId: number;

  @Column('boolean', { name: 'is_main' })
  isMain: boolean;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(() => User, (users) => users.companies)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
