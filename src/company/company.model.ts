import { User } from '../users/users.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '../location/location.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

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

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
