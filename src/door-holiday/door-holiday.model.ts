import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DoorHolidayTimetable } from '../door-holiday-timetable/door-holiday-timetable.model';
import { Door } from '../door/door.model';
import { Holiday } from '../holiday/holiday.model';

@Entity('door_holiday')
export class DoorHoliday {
  @Column('integer', { primary: true, name: 'door_id' })
  doorId: number;

  @Column('integer', { primary: true, name: 'holiday_id' })
  holidayId: number;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @ManyToOne(() => Door, (door) => door.holidays)
  @JoinColumn([{ name: 'door_id', referencedColumnName: 'id' }])
  door: Door;

  @ManyToOne(() => Holiday, (holiday) => holiday.doorHolidays)
  @JoinColumn([{ name: 'holiday_id', referencedColumnName: 'id' }])
  holiday: Holiday;

  @OneToMany(
    () => DoorHolidayTimetable,
    (doorHolidayTimetable) => doorHolidayTimetable.holidays,
    { cascade: true },
  )
  timetables: DoorHolidayTimetable[];
}
