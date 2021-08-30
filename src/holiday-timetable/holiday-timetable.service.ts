import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HolidayTimetable } from './holiday-timetable.model';

@Injectable()
export class HolidayTimetableService {
  constructor(
    @InjectRepository(HolidayTimetable)
    private readonly holidayTimetableRepository: Repository<HolidayTimetable>,
  ) {}

  async removeAll(holidayTimetables: HolidayTimetable[]) {
    if (!holidayTimetables || !holidayTimetables.length) {
      return [];
    }

    return await this.holidayTimetableRepository.remove(holidayTimetables);
  }
}
