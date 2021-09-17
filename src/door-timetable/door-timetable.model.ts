import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Door } from '../door/door.model';
import { TypeDayOfWeek } from '../timetable/timetable.model';

@Entity('door_timetable')
export class DoorTimetable {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('enum', {
    name: 'day',
    enum: TypeDayOfWeek,
  })
  day: TypeDayOfWeek;

  @Column('time with time zone', { name: 'start_time', nullable: true })
  startTime: string;

  @Column('time with time zone', { name: 'end_time', nullable: true })
  endTime: string;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;

  @Column('integer', { name: 'door_id' })
  doorId: number;

  @ManyToOne(() => Door, (door) => door.timetables)
  @JoinColumn([{ name: 'door_id', referencedColumnName: 'id' }])
  door: Door;
}
