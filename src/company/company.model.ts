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

  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];

  @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
  users: UserCompany[];
}
