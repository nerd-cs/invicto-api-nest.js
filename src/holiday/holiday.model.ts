import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DoorHoliday } from '../door-holiday/door-holiday.model';
import { ScheduleHoliday } from '../schedule-holiday/schedule-holiday.model';

export enum TypeHolidayRecurrence {
  ONCE = 'ONCE',
  EVERY_MONTH = 'EVERY_MONTH',
  EVERY_YEAR = 'EVERY_YEAR',
}
@Entity('holiday')
export class Holiday {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @ApiProperty()
  @Column('varchar', { name: 'name', unique: true })
  name: string;

  @ApiProperty({
    enumName: 'TypeHolidayRecurrence',
    enum: TypeHolidayRecurrence,
  })
  @Column('enum', {
    name: 'recurrence',
    enum: TypeHolidayRecurrence,
  })
  recurrence: TypeHolidayRecurrence;

  @ApiProperty()
  @Column('date', { name: 'start_date' })
  startDate: Date;

  @ApiProperty()
  @Column('date', { name: 'end_date' })
  endDate: Date;

  @ApiProperty()
  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @OneToMany(
    () => ScheduleHoliday,
    (scheduleHoliday) => scheduleHoliday.holiday,
  )
  schedules: ScheduleHoliday[];

  @OneToMany(() => DoorHoliday, (doorHoliday) => doorHoliday.holiday)
  doorHolidays: DoorHoliday[];
}
