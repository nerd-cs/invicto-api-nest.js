import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoorTimetable } from './door-timetable.model';
import { DoorTimetableService } from './door-timetable.service';

@Module({
  imports: [TypeOrmModule.forFeature([DoorTimetable])],
  providers: [DoorTimetableService],
  exports: [DoorTimetableService],
})
export class DoorTimetableModule {}
