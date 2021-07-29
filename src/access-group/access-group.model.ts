import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../location/location.model';
import { Schedule } from '../schedule/schedule.model';
import { User } from '../users/users.model';
import { Zone } from '../zone/zone.model';
import { AccessGroupScheduleZone } from '../access-group-schedule-zone/access-group-schedule-zone.model';

@Entity('access_group')
export class AccessGroup {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @ApiModelProperty()
  id: number;

  @Column('varchar', { name: 'name' })
  @ApiModelProperty()
  name: string;

  @Column('varchar', { name: 'description', nullable: true })
  description: string;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column('boolean', { name: 'is_active', default: () => 'true' })
  isActive: boolean;

  @ManyToOne(() => Location, (location) => location.accessGroups)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;

  @ManyToMany(() => User, (users) => users.accessGroups)
  @JoinTable({
    name: 'user_access_group',
    joinColumns: [{ name: 'access_group_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
  })
  users: User[];

  @OneToMany(() => Zone, (zone) => zone.location)
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
