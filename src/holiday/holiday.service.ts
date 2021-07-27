import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
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
  ) {}

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
    const offset = (paginationDto.page - 1) * paginationDto.limit;

    return await this.holidayRepository.find({
      order: { name: 'ASC' },
      take: paginationDto.limit,
      skip: offset,
    });
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
    const holiday = await this.getById(holidayId);

    return await this.holidayRepository.remove(holiday);
  }

  async getById(holidayId: number) {
    const holiday = await this.holidayRepository.findOne(holidayId);

    if (!holiday) {
      throw new EntityNotFoundException({ holidayId: holidayId });
    }

    return holiday;
  }
}
