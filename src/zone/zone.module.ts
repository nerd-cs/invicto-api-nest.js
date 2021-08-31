import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessGroupScheduleZoneModule } from '../access-group-schedule-zone/access-group-schedule-zone.module';
import { DoorModule } from '../door/door.module';
import { LocationModule } from '../location/location.module';
import { ZoneController } from './zone.controller';
import { Zone } from './zone.model';
import { ZoneService } from './zone.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zone]),
    LocationModule,
    DoorModule,
    AccessGroupScheduleZoneModule,
  ],
  controllers: [ZoneController],
  providers: [ZoneService],
  exports: [ZoneService],
})
export class ZoneModule {}
