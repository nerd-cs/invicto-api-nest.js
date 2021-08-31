import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleHoliday } from './schedule-holiday.model';

@Injectable()
export class ScheduleHolidayService {
  constructor(
    @InjectRepository(ScheduleHoliday)
    private readonly scheduleHolidayRepository: Repository<ScheduleHoliday>,
  ) {}

  async removeAll(scheduleHolidays: ScheduleHoliday[]) {
    if (!scheduleHolidays || !scheduleHolidays.length) {
      return [];
    }

    return await this.scheduleHolidayRepository.remove(scheduleHolidays);
  }
}
