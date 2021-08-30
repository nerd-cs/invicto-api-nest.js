import { Module } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './holiday.model';
import { IsBeforeOrEqualConstraint } from '../validation/before-or-equal.constraint';
import { ScheduleHolidayModule } from '../schedule-holiday/schedule-holiday.module';
import { HolidayTimetableModule } from '../holiday-timetable/holiday-timetable.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Holiday]),
    ScheduleHolidayModule,
    HolidayTimetableModule,
  ],
  controllers: [HolidayController],
  providers: [HolidayService, IsBeforeOrEqualConstraint],
  exports: [HolidayService],
})
export class HolidayModule {}
