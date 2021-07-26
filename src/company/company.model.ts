import { User } from '../users/users.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from '../location/location.model';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name' })
  name: string;

  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
