import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoorHolidayTimetable } from './door-holiday-timetable.model';
import { DoorHolidayTimetableService } from './door-holiday-timetable.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoorHolidayTimetable])],
  providers: [DoorHolidayTimetableService],
  exports: [DoorHolidayTimetableService],
})
export class DoorHolidayTimetableModule {}
