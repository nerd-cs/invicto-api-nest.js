import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TypeHolidayRecurrence {
  ONCE = 'ONCE',
  EVERY_MONTH = 'EVERY_MONTH',
  EVERY_YEAR = 'EVERY_YEAR',
}
@Entity('holiday')
export class Holiday {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true })
  name: string;

  @Column('enum', {
    name: 'recurrence',
    enum: TypeHolidayRecurrence,
  })
  recurrence: TypeHolidayRecurrence;

  @Column('date', { name: 'start_date' })
  startDate: Date;

  @Column('date', { name: 'end_date' })
  endDate: Date;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;
}
