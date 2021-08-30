import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayTimetable } from './holiday-timetable.model';
import { HolidayTimetableService } from './holiday-timetable.service';

@Module({
  imports: [TypeOrmModule.forFeature([HolidayTimetable])],
  providers: [HolidayTimetableService],
  exports: [HolidayTimetableService],
})
export class HolidayTimetableModule {}
