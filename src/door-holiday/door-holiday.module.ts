import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoorHoliday } from './door-holiday.model';
import { DoorHolidayService } from './door-holiday.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoorHoliday])],
  providers: [DoorHolidayService],
  exports: [DoorHolidayService],
})
export class DoorHolidayModule {}
