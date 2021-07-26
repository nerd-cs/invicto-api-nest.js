import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessGroup } from '../access-group/access-group.model';
import { Location } from '../location/location.model';
import { Door } from '../door/door.model';

@Entity('zone')
export class Zone {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true })
  name: string;

  @Column('varchar', { name: 'description', nullable: true })
  description: string;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @ManyToOne(() => AccessGroup, (accessGroup) => accessGroup.zones)
  @JoinColumn([{ name: 'access_group_id', referencedColumnName: 'id' }])
  accessGroup: AccessGroup;

  @ManyToOne(() => Location, (location) => location.zones)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;

  @ManyToMany(() => Door, (door) => door.zones)
  doors: Door[];

  @ManyToMany(() => Zone, (zone) => zone.childZones)
  @JoinTable({
    name: 'meta_zone',
    joinColumns: [{ name: 'parent_zone_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'child_zone_id', referencedColumnName: 'id' }],
  })
  childZones: Zone[];

  @ManyToMany(() => Zone, (zone) => zone.parentZones)
  @JoinTable({
    name: 'meta_zone',
    joinColumns: [{ name: 'child_zone_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [
      { name: 'parent_zone_id', referencedColumnName: 'id' },
    ],
  })
  parentZones: Zone[];
}
