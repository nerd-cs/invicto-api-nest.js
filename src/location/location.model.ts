import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessGroup } from '../access-group/access-group.model';
import { Company } from '../company/company.model';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name' })
  name: string;

  @OneToMany(() => AccessGroup, (accessGroup) => accessGroup.location)
  accessGroups: AccessGroup[];

  @ManyToOne(() => Company, (company) => company.locations)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: Company;
}
