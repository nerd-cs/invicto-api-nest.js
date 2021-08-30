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
    return await this.scheduleHolidayRepository.remove(scheduleHolidays);
  }
}
