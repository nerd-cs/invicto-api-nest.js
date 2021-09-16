import { Module } from '@nestjs/common';
import { DoorService } from './door.service';
import { DoorController } from './door.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Door } from './door.model';
import { LocationModule } from '../location/location.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { HolidayModule } from '../holiday/holiday.module';
import { DoorHolidayTimetableModule } from '../door-holiday-timetable/door-holiday-timetable.module';
import { DoorHolidayModule } from '../door-holiday/door-holiday.module';
import { DoorTimetableModule } from '../door-timetable/door-timetable.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Door]),
    LocationModule,
    ScheduleModule,
    HolidayModule,
    DoorHolidayTimetableModule,
    DoorHolidayModule,
    DoorTimetableModule,
  ],
  providers: [DoorService],
  controllers: [DoorController],
  exports: [DoorService],
})
export class DoorModule {}
