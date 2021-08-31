import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScheduleHoliday } from '../schedule-holiday/schedule-holiday.model';

@Entity('holiday_timetable')
export class HolidayTimetable {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'schedule_id' })
  scheduleId: number;

  @Column('integer', { name: 'holiday_id' })
  holidayId: number;

  @Column('time with time zone', { name: 'start_time', nullable: true })
  startTime: string;

  @Column('time with time zone', { name: 'end_time', nullable: true })
  endTime: string;

  @ManyToOne(
    () => ScheduleHoliday,
    (scheduleHoliday) => scheduleHoliday.timetables,
  )
  @JoinColumn([
    { name: 'schedule_id', referencedColumnName: 'scheduleId' },
    { name: 'holiday_id', referencedColumnName: 'holidayId' },
  ])
  scheduleHoliday: ScheduleHoliday;
}
