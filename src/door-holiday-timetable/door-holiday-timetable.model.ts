import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DoorHoliday } from '../door-holiday/door-holiday.model';

@Entity('door_holiday_timetable')
export class DoorHolidayTimetable {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'door_id' })
  doorId: number;

  @Column('integer', { name: 'holiday_id' })
  holidayId: number;

  @Column('time with time zone', { name: 'start_time', nullable: true })
  startTime: string;

  @Column('time with time zone', { name: 'end_time', nullable: true })
  endTime: string;

  @ManyToOne(() => DoorHoliday, (doorHoliday) => doorHoliday.timetables)
  @JoinColumn([
    { name: 'door_id', referencedColumnName: 'doorId' },
    { name: 'holiday_id', referencedColumnName: 'holidayId' },
  ])
  holidays: DoorHoliday;
}
