import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { HolidayTimetable } from '../holiday-timetable/holiday-timetable.model';
import { Holiday } from '../holiday/holiday.model';
import { Schedule } from '../schedule/schedule.model';

@Entity('schedule_holiday')
export class ScheduleHoliday {
  @Column('integer', { primary: true, name: 'schedule_id' })
  scheduleId: number;

  @Column('integer', { primary: true, name: 'holiday_id' })
  holidayId: number;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Holiday, (holiday) => holiday.schedules)
  @JoinColumn([{ name: 'holiday_id', referencedColumnName: 'id' }])
  holiday: Holiday;

  @ManyToOne(() => Schedule, (schedule) => schedule.holidays)
  @JoinColumn([{ name: 'schedule_id', referencedColumnName: 'id' }])
  schedule: Schedule;

  @OneToMany(() => HolidayTimetable, (timetable) => timetable.scheduleHoliday, {
    cascade: true,
  })
  timetables: HolidayTimetable[];
}
