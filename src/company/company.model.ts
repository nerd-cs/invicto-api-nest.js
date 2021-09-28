import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../location/location.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { UserCompany } from '../user-company/user-company.model';
import { Department } from '../department/department.model';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @ApiModelProperty()
  id: number;

  @Column('varchar', { name: 'name' })
  @ApiModelProperty()
  name: string;

  @Column('varchar', { name: 'address' })
  address: string;

  @Column('varchar', { name: 'city' })
  city: string;

  @Column('varchar', { name: 'postal_code' })
  postalCode: string;

  @Column('varchar', { name: 'country' })
  country: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  users: UserCompany[];

  @Column({ type: 'integer', select: false, update: false, insert: false })
  members: number;

  @OneToMany(() => Department, (department) => department.company, {
    cascade: true,
  })
  departments: Department[];
}
