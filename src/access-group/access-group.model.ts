import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../location/location.model';
import { Schedule } from '../schedule/schedule.model';
import { Zone } from '../zone/zone.model';
import { AccessGroupScheduleZone } from '../access-group-schedule-zone/access-group-schedule-zone.model';
import { UserAccessGroup } from '../user-access-group/user-access-group.model';

@Entity('access_group')
export class AccessGroup {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @ApiModelProperty()
  id: number;

  @Column('varchar', { name: 'name' })
  @ApiModelProperty()
  name: string;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column('integer', { name: 'location_id' })
  locationId: number;

  @ManyToOne(() => Location, (location) => location.accessGroups)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;

  @OneToMany(
    () => UserAccessGroup,
    (userAccessGroup) => userAccessGroup.accessGroup,
  )
  users: UserAccessGroup[];

  @OneToMany(() => Zone, (zone) => zone.accessGroup)
  zones: Zone[];

  @OneToMany(() => Schedule, (schedule) => schedule.accessGroup)
  schedules: Schedule[];

  @OneToMany(
    () => AccessGroupScheduleZone,
    (accessGroupScheduleZone) => accessGroupScheduleZone.accessGroup,
    { cascade: true },
  )
  zoneSchedules: AccessGroupScheduleZone[];
}
