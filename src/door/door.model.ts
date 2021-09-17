import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from '../zone/zone.model';
import { Location } from '../location/location.model';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { DoorHoliday } from '../door-holiday/door-holiday.model';
import { DoorTimetable } from '../door-timetable/door-timetable.model';

export enum TypeDoorStatus {
  PENDING = 'PENDING',
  NOT_PAIRED = 'NOT_PAIRED',
  PAIRED = 'PAIRED',
}
@Entity('door')
export class Door {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @ApiModelProperty()
  id: number;

  @Column('varchar', { name: 'name', unique: true })
  @ApiModelProperty()
  name: string;

  @Column('enum', { name: 'status', enum: TypeDoorStatus })
  @ApiProperty({ enum: TypeDoorStatus, enumName: 'TypeDoorStatus' })
  status: TypeDoorStatus;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  @ApiModelProperty()
  updatedAt: Date;

  @ManyToOne(() => Location, (location) => location.doors)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;

  @ManyToMany(() => Zone, (zone) => zone.doors)
  @JoinTable({
    name: 'zone_door',
    joinColumns: [{ name: 'door_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'zone_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  zones: Zone[];

  @OneToMany(() => DoorHoliday, (doorHoliday) => doorHoliday.door, {
    cascade: true,
  })
  holidays: DoorHoliday[];

  @OneToMany(() => DoorTimetable, (doorTimetable) => doorTimetable.door, {
    cascade: true,
  })
  timetables: DoorTimetable[];
}
