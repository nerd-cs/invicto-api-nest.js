import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessGroupScheduleZone } from './access-group-schedule-zone.model';
import { AccessGroupScheduleZoneService } from './access-group-schedule-zone.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccessGroupScheduleZone])],
  providers: [AccessGroupScheduleZoneService],
  exports: [AccessGroupScheduleZoneService],
})
export class AccessGroupScheduleZoneModule {}
