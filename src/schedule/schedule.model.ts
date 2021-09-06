import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessGroupScheduleZone } from '../access-group-schedule-zone/access-group-schedule-zone.model';
import { AccessGroup } from '../access-group/access-group.model';
import { ScheduleHoliday } from '../schedule-holiday/schedule-holiday.model';
import { Timetable } from '../timetable/timetable.model';

@Entity('schedule')
export class Schedule {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiResponseProperty()
  @Column('varchar', { name: 'name', unique: true })
  name: string;

  @ApiResponseProperty()
  @Column('varchar', { name: 'description', nullable: true })
  description: string;

  @ApiResponseProperty()
  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @ManyToOne(() => AccessGroup, (accessGroup) => accessGroup.schedules)
  @JoinColumn([{ name: 'access_group_id', referencedColumnName: 'id' }])
  accessGroup: AccessGroup;

  @OneToMany(
    () => ScheduleHoliday,
    (scheduleHoliday) => scheduleHoliday.schedule,
    { cascade: true },
  )
  holidays: ScheduleHoliday[];

  @OneToMany(() => Timetable, (timetable) => timetable.schedule, {
    cascade: true,
  })
  timetables: Timetable[];

  @OneToMany(
    () => AccessGroupScheduleZone,
    (accessGroupScheduleZone) => accessGroupScheduleZone.schedule,
  )
  accessGroupScheduleZones: AccessGroupScheduleZone[];
}
