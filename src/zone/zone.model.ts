import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessGroup } from '../access-group/access-group.model';
import { Location } from '../location/location.model';
import { Door } from '../door/door.model';
import { AccessGroupScheduleZone } from '../access-group-schedule-zone/access-group-schedule-zone.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ChildZoneResponse } from './response/child-zone.response';

@Entity('zone')
export class Zone {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @ApiModelProperty()
  id: number;

  @Column('varchar', { name: 'name', unique: true })
  @ApiModelProperty()
  name: string;

  @Column('varchar', { name: 'description', nullable: true })
  @ApiModelProperty({ required: false })
  description: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  @ApiModelProperty()
  updatedAt: Date;

  @ManyToOne(() => AccessGroup, (accessGroup) => accessGroup.zones)
  @JoinColumn([{ name: 'access_group_id', referencedColumnName: 'id' }])
  accessGroup: AccessGroup;

  @ManyToOne(() => Location, (location) => location.zones)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;

  @ManyToMany(() => Door, (door) => door.zones)
  @ApiModelProperty({
    required: false,
    isArray: true,
    type: () => Door,
  })
  doors: Door[];

  @ManyToMany(() => Zone, (zone) => zone.childZones)
  @JoinTable({
    name: 'meta_zone',
    joinColumns: [{ name: 'parent_zone_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'child_zone_id', referencedColumnName: 'id' }],
  })
  @ApiModelProperty({ required: false, isArray: true, type: ChildZoneResponse })
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

  @OneToMany(
    () => AccessGroupScheduleZone,
    (accessGroupScheduleZone) => accessGroupScheduleZone.zone,
  )
  accessGroupScheduleZones: AccessGroupScheduleZone[];
}
