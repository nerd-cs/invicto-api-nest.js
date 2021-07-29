import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.model';
import { HolidayModule } from '../holiday/holiday.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), HolidayModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
