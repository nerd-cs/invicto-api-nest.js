import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from '../holiday/holiday.model';
import { Schedule } from '../schedule/schedule.model';
import { ScheduleHoliday } from './schedule-holiday.model';
import { ScheduleHolidayService } from './schedule-holiday.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleHoliday, Holiday, Schedule])],
  providers: [ScheduleHolidayService],
  exports: [ScheduleHolidayService],
})
export class ScheduleHolidayModule {}
