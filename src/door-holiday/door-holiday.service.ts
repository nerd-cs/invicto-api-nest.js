import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoorHoliday } from './door-holiday.model';

@Injectable()
export class DoorHolidayService {
  constructor(
    @InjectRepository(DoorHoliday)
    private readonly doorHolidayRepository: Repository<DoorHoliday>,
  ) {}

  async removeAll(holidays: DoorHoliday[]) {
    if (!holidays?.length) {
      return;
    }

    return await this.doorHolidayRepository.remove(holidays);
  }
}
