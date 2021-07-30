import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../location/location.model';

export enum TypeControllerStatus {
  PENDING = 'PENDING',
  PAIRED = 'PAIRED',
  NO_SIGNAL = 'NO_SIGNAL',
}
@Entity('controller')
export class Controller {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true })
  name: string;

  @Column('enum', { name: 'status', enum: TypeControllerStatus })
  status: TypeControllerStatus;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @OneToOne(() => Location, (location) => location.controller)
  @JoinColumn([{ name: 'location_id', referencedColumnName: 'id' }])
  location: Location;
}
