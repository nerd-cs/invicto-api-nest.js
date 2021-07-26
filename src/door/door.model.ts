import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from '../zone/zone.model';
import { Location } from '../location/location.model';

export enum TypeDoorStatus {
  PENDING = 'PENDING',
  NOT_PAIRED = 'NOT_PAIRED',
  PAIRED = 'PAIRED',
}
@Entity('door')
export class Door {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true })
  name: string;

  @Column('enum', { name: 'status', enum: TypeDoorStatus })
  status: TypeDoorStatus;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @ManyToOne(() => Location, (location) => location.doors)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;

  @ManyToMany(() => Zone, (zone) => zone.doors)
  @JoinTable({
    name: 'zone_door',
    joinColumns: [{ name: 'door_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'zone_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  zones: Zone[];
}
