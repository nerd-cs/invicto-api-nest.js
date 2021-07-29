import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from '../holiday/holiday.model';
import { Schedule } from '../schedule/schedule.model';
import { ScheduleHoliday } from './schedule-holiday.model';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduleHoliday, Holiday, Schedule])],
})
export class ScheduleHolidayModule {}
