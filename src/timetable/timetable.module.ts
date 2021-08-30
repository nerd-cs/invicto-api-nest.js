import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from './timetable.model';
import { TimetableService } from './timetable.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timetable])],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule {}
