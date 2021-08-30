import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.model';
import { HolidayModule } from '../holiday/holiday.module';
import { TimetableModule } from '../timetable/timetable.module';
import { ScheduleHolidayModule } from '../schedule-holiday/schedule-holiday.module';
import { AccessGroupScheduleZoneModule } from '../access-group-schedule-zone/access-group-schedule-zone.module';
import { HolidayTimetableModule } from '../holiday-timetable/holiday-timetable.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    HolidayModule,
    TimetableModule,
    ScheduleHolidayModule,
    AccessGroupScheduleZoneModule,
    HolidayTimetableModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
