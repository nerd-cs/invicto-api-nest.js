import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '../location/location.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { UserCompany } from '../user-company/user-company.model';

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

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  users: UserCompany[];

  @Column('integer', { select: false })
  members: number;
}
