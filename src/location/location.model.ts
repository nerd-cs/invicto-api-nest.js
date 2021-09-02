import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccessGroupScheduleZone } from '../access-group-schedule-zone/access-group-schedule-zone.model';
import { Company } from '../company/company.model';
import { Controller } from '../controller/controller.model';
import { Door } from '../door/door.model';
import { Zone } from '../zone/zone.model';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  @ApiModelProperty()
  id: number;

  @Column('varchar', { name: 'name' })
  @ApiModelProperty()
  name: string;

  @ManyToOne(() => Company, (company) => company.locations)
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'id' }])
  company: Company;

  @OneToMany(() => Door, (door) => door.location)
  doors: Door[];

  @OneToMany(() => Zone, (zone) => zone.location)
  zones: Zone[];

  @OneToOne(() => Controller, (controller) => controller.location)
  controller: Controller;

  @OneToMany(
    () => AccessGroupScheduleZone,
    (accessGroupScheduleZone) => accessGroupScheduleZone.location,
  )
  accessGroupScheduleZones: AccessGroupScheduleZone[];
}
