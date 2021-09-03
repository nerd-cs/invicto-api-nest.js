import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { HolidayTimetableService } from '../holiday-timetable/holiday-timetable.service';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { ScheduleHolidayService } from '../schedule-holiday/schedule-holiday.service';
import { IsBeforeOrEqualConstraint } from '../validation/before-or-equal.constraint';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { Holiday } from './holiday.model';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
    private readonly isBeforeOrEqualConstraint: IsBeforeOrEqualConstraint,
    private readonly scheduleHolidayService: ScheduleHolidayService,
    private readonly holidayTimetableService: HolidayTimetableService,
  ) {}

  async getAllHolidays() {
    return await this.holidayRepository.find({ order: { name: 'ASC' } });
  }

  async create(createHolidayDto: CreateHolidayDto) {
    await this.throwIfNameAlreadyTaken(createHolidayDto.name);

    return await this.holidayRepository.save(createHolidayDto);
  }

  async throwIfNameAlreadyTaken(name: string) {
    const existingHoliday = await this.findByName(name);

    if (existingHoliday) {
      throw new EntityAlreadyExistsException({ name: name });
    }
  }

  async findByName(name: string) {
    return await this.holidayRepository.findOne({ where: { name: name } });
  }

  async getHolidaysPage(paginationDto: PaginationRequestDto) {
    const offset = paginationDto.page
      ? (paginationDto.page - 1) * paginationDto.limit
      : undefined;

    const [page, total] = await this.holidayRepository.findAndCount({
      order: { name: 'ASC' },
      take: paginationDto.limit,
      skip: offset,
    });

    return {
      holidays: page,
      total,
    };
  }

  async updateHoliday(updateHolidayDto: UpdateHolidayDto) {
    const holiday = await this.getById(updateHolidayDto.id);

    if (updateHolidayDto.name && updateHolidayDto.name !== holiday.name) {
      await this.throwIfNameAlreadyTaken(updateHolidayDto.name);
    }

    holiday.recurrence = updateHolidayDto.recurrence || holiday.recurrence;
    holiday.startDate = updateHolidayDto.startDate || holiday.startDate;
    holiday.endDate = updateHolidayDto.endDate || holiday.endDate;

    this.validateDates(holiday);

    return await this.holidayRepository.save(holiday);
  }

  private validateDates(holiday: Holiday) {
    const validationOptions = {
      object: holiday,
      constraints: ['endDate'],
      value: holiday.startDate,
      targetName: 'startDate',
      property: 'startDate',
    };

    if (
      !this.isBeforeOrEqualConstraint.validate(
        holiday.startDate,
        validationOptions,
      )
    ) {
      throw new ConstraintViolationException(
        this.isBeforeOrEqualConstraint.defaultMessage(validationOptions),
      );
    }
  }

  async deleteHoliday(holidayId: number) {
    const holiday = await this.getById(holidayId, [
      'schedules',
      'schedules.timetables',
    ]);

    await this.holidayTimetableService.removeAll(
      holiday.schedules
        .map((schedule) => schedule.timetables)
        .reduce((prev, next) => prev.concat(next), []),
    );
    await this.scheduleHolidayService.removeAll(holiday.schedules);

    return await this.holidayRepository.remove(holiday);
  }

  async getById(holidayId: number, relations: string[] = undefined) {
    const holiday = await this.holidayRepository.findOne(holidayId, {
      relations: relations,
    });

    if (!holiday) {
      throw new EntityNotFoundException({ holidayId: holidayId });
    }

    return holiday;
  }

  async validateIds(ids: number[]) {
    const uniqueIds = Array.from(new Set(ids));
    const holidays = await this.holidayRepository.findByIds(ids);

    if (!holidays || holidays.length != uniqueIds.length) {
      throw new EntityNotFoundException({
        holidayIds: uniqueIds,
      });
    }
  }
}
