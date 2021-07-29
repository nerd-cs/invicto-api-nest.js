import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schedule } from '../schedule/schedule.model';

export enum TypeDayOfWeek {
  MONADAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}
@Entity('timetable')
export class Timetable {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'day',
    enum: TypeDayOfWeek,
  })
  day: TypeDayOfWeek;

  @Column('time with time zone', { name: 'start_time' })
  startTime: string;

  @Column('time with time zone', { name: 'end_time' })
  endTime: string;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @Column('integer', { name: 'schedule_id' })
  scheduleId: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.timetables)
  @JoinColumn([{ name: 'schedule_id', referencedColumnName: 'id' }])
  schedule: Schedule;
}
