import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessGroupScheduleZone } from './access-group-schedule-zone.model';

@Module({
  imports: [TypeOrmModule.forFeature([AccessGroupScheduleZone])],
})
export class AccessGroupScheduleZoneModule {}
