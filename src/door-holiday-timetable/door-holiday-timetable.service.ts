import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoorHolidayTimetable } from './door-holiday-timetable.model';

@Injectable()
export class DoorHolidayTimetableService {
  constructor(
    @InjectRepository(DoorHolidayTimetable)
    private readonly doorHolidayTimetableRepository: Repository<DoorHolidayTimetable>,
  ) {}

  async removeAll(timetables: DoorHolidayTimetable[]) {
    if (!timetables?.length) {
      return;
    }

    return await this.doorHolidayTimetableRepository.remove(timetables);
  }
}
