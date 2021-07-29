import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from './timetable.model';

@Module({
  imports: [TypeOrmModule.forFeature([Timetable])],
})
export class TimetableModule {}
