import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Schedule } from '../schedule/schedule.model';
import { Zone } from '../zone/zone.model';
import { AccessGroup } from '../access-group/access-group.model';
import { ApiProperty } from '@nestjs/swagger';
import { ChildZoneResponse } from '../zone/response/child-zone.response';

@Entity('access_group_schedule_zone')
export class AccessGroupScheduleZone {
  @Column('integer', { primary: true, name: 'access_group_id' })
  accessGroupId: number;

  @Column('integer', { primary: true, name: 'schedule_id' })
  scheduleId: number;

  @Column('integer', { primary: true, name: 'zone_id' })
  zoneId: number;

  @ManyToOne(() => AccessGroup, (accessGroup) => accessGroup.zoneSchedules)
  @JoinColumn([{ name: 'access_group_id', referencedColumnName: 'id' }])
  accessGroup: AccessGroup;

  @ManyToOne(() => Schedule, (schedule) => schedule.accessGroupScheduleZones)
  @JoinColumn([{ name: 'schedule_id', referencedColumnName: 'id' }])
  @ApiProperty({ type: () => Schedule })
  schedule: Schedule;

  @ManyToOne(() => Zone, (zone) => zone.accessGroupScheduleZones)
  @JoinColumn([{ name: 'zone_id', referencedColumnName: 'id' }])
  @ApiProperty({ type: () => ChildZoneResponse })
  zone: Zone;
}
