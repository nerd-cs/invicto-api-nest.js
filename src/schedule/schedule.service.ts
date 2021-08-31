import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessGroupScheduleZoneService } from '../access-group-schedule-zone/access-group-schedule-zone.service';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { HolidayService } from '../holiday/holiday.service';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { ScheduleHolidayService } from '../schedule-holiday/schedule-holiday.service';
import { CreateTimetableDto } from '../timetable/dto/create-timetable.dto';
import { UpdateTimetableDto } from '../timetable/dto/update-timetable.dto';
import { TimetableService } from '../timetable/timetable.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schedule.model';

export const FAKE_DATE = 'Jan 1, 2021';
export const HOURS_REGEX = /(\d{1,2})(:)/;
@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly holidayService: HolidayService,
    private readonly timetableService: TimetableService,
    private readonly scheduleHolidayService: ScheduleHolidayService,
    private readonly accessGroupScheduleZoneService: AccessGroupScheduleZoneService,
  ) {}

  async createSchedule(scheduleDto: CreateScheduleDto) {
    const { timetables: timetableDtos, ...restAttributes } = scheduleDto;

    await this.throwIfNameAlreadyTaken(restAttributes.name);

    restAttributes['timetables'] = this.prepareTimetables(timetableDtos);

    if (restAttributes.holidays) {
      const holidayIds = restAttributes.holidays.map(
        (holiday) => holiday.holidayId,
      );

      await this.holidayService.validateIds(holidayIds);
    }

    return this.scheduleRepository.save(restAttributes);
  }

  private prepareTimetables(timetableDtos: CreateTimetableDto[]) {
    const timetables = [];

    timetableDtos.forEach((timetable) => {
      const timeslots = timetable.timeslots;

      if (timeslots && timeslots.length) {
        timeslots.forEach((timeslot) => {
          timetables.push({
            day: timetable.day,
            isActive: timetable.isActive,
            startTime: timeslot.startTime,
            endTime: timeslot.endTime,
          });
        });
      } else {
        timetables.push({
          day: timetable.day,
          isActive: timetable.isActive,
        });
      }
    });

    return timetables;
  }

  async throwIfNameAlreadyTaken(name: string) {
    if (await this.findByName(name)) {
      throw new EntityAlreadyExistsException({ name: name });
    }
  }

  async findByName(name: string) {
    return await this.scheduleRepository.findOne({ where: { name: name } });
  }

  async getSchedulesPage(paginationDto: PaginationRequestDto) {
    const offset = (paginationDto.page - 1) * paginationDto.limit;

    const schedulePage = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .select(['schedule', 'holiday.name'])
      .leftJoinAndSelect(
        'schedule.holidays',
        'holidays',
        'holidays.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndSelect('holidays.holiday', 'holiday')
      .orderBy('schedule.name', 'ASC')
      .skip(offset)
      .take(paginationDto.limit)
      .getMany();

    const result = [];

    schedulePage.forEach((schedule) => {
      const { holidays, ...rest } = schedule;

      rest['holidays'] = holidays
        .map((scheduleHoliday) => scheduleHoliday.holiday)
        .map((holiday) => holiday.name);

      result.push(rest);
    });

    return result;
  }

  async getSchedulesList() {
    return await this.scheduleRepository.find({ order: { name: 'ASC' } });
  }

  async getScheduleDescription(scheduleId: number) {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.holidays', 'holidays')
      .leftJoinAndSelect('holidays.holiday', 'holiday')
      .leftJoinAndSelect('schedule.timetables', 'timetables')
      .where('schedule.id = :scheduleId', { scheduleId })
      .getOne();

    if (!schedule) {
      throw new EntityNotFoundException({ scheduleId });
    }

    const { timetables, holidays, ...rest } = schedule;

    rest['holidays'] = [];

    holidays.forEach((scheduleHoliday) => {
      scheduleHoliday.holiday['isActive'] = scheduleHoliday.isActive;
      rest['holidays'].push(scheduleHoliday.holiday);
    });

    const timeslotsPerDay = new Map();

    timetables.forEach((timetable) => {
      const value = timeslotsPerDay.get(timetable.day);
      let timeslot;

      if (timetable.startTime && timetable.endTime) {
        timeslot = {
          id: timetable.id,
          startTime: this.prepareTime(timetable.startTime),
          endTime: this.prepareTime(timetable.endTime),
        };
      }

      if (value) {
        value['timeslots'].push(timeslot);
      } else {
        timeslotsPerDay.set(timetable.day, {
          isActive: timetable.isActive,
          timeslots: timeslot ? [timeslot] : [],
        });
      }
    });

    rest['timetables'] = Array.from(timeslotsPerDay.entries());

    return rest;
  }

  private prepareTime(time: string) {
    const date = new Date(`${FAKE_DATE} ${time}`);

    const preparedTime = date.toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    if (preparedTime.match(HOURS_REGEX)[1].length < 2) {
      return `0${preparedTime}`;
    }

    return preparedTime;
  }

  async updateSchedule(scheduleDto: UpdateScheduleDto) {
    const schedule = await this.getById(scheduleDto.id, [
      'holidays',
      'holidays.holiday',
      'timetables',
    ]);
    const { timetables: timetableUpdateDtos, ...rest } = scheduleDto;

    if (scheduleDto.name && scheduleDto.name !== schedule.name) {
      await this.throwIfNameAlreadyTaken(scheduleDto.name);
      schedule.name = scheduleDto.name;
    }

    if (scheduleDto.holidays) {
      const holidayIds = scheduleDto.holidays.map(
        (holiday) => holiday.holidayId,
      );

      await this.holidayService.validateIds(holidayIds);
      await this.scheduleHolidayService.removeAll(schedule.holidays);
    }

    if (timetableUpdateDtos) {
      await this.scheduleRepository
        .createQueryBuilder()
        .delete()
        .from('Timetable')
        .where('schedule_id = :scheduleId', { scheduleId: schedule.id })
        .execute();
      rest['timetables'] = this.prepareUpdatedTimetables(timetableUpdateDtos);
    }

    return await this.scheduleRepository.save(rest);
  }

  private prepareUpdatedTimetables(updateDtos: UpdateTimetableDto[]) {
    const timetables = [];

    updateDtos.forEach((timetable) => {
      const timeslots = timetable.timeslots;

      if (timeslots && timeslots.length) {
        timeslots.forEach((timeslot) => {
          const prepared = {
            day: timetable.day,
            isActive: timetable.isActive,
            startTime: timeslot.startTime,
            endTime: timeslot.endTime,
          };

          if (timeslot.id) {
            prepared['id'] = timeslot.id;
          }

          timetables.push(prepared);
        });
      } else {
        timetables.push({
          day: timetable.day,
          isActive: timetable.isActive,
        });
      }
    });

    return timetables;
  }

  async deleteSchedule(scheduleId: number) {
    const schedule = await this.getById(scheduleId, [
      'timetables',
      'holidays',
      'accessGroupScheduleZones',
    ]);

    await this.timetableService.removeAll(schedule.timetables);
    await this.scheduleHolidayService.removeAll(schedule.holidays);
    await this.accessGroupScheduleZoneService.removeAll(
      schedule.accessGroupScheduleZones,
    );

    return await this.scheduleRepository.remove(schedule);
  }

  async getById(scheduleId: number, relations: string[]) {
    const schedule = await this.scheduleRepository.findOne(scheduleId, {
      relations: relations,
    });

    if (!schedule) {
      throw new EntityNotFoundException({ scheduleId: scheduleId });
    }

    return schedule;
  }
}
