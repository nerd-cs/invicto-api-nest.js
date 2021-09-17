import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import { Location } from '../location/location.model';
import { Door, TypeDoorStatus } from './door.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { HolidayService } from '../holiday/holiday.service';
import { DoorHolidayTimetableService } from '../door-holiday-timetable/door-holiday-timetable.service';
import { DoorHolidayService } from '../door-holiday/door-holiday.service';
import { DoorTimetableService } from '../door-timetable/door-timetable.service';

@Injectable()
export class DoorService {
  constructor(
    @InjectRepository(Door) private readonly doorRepository: Repository<Door>,
    private readonly locationService: LocationService,
    private readonly scheduleService: ScheduleService,
    private readonly holidayService: HolidayService,
    private readonly holidayTimetableService: DoorHolidayTimetableService,
    private readonly doorHolidayService: DoorHolidayService,
    private readonly doorTimetableService: DoorTimetableService,
  ) {}

  async getAllForLocation(locationId: number) {
    const location = await this.locationService.getById(locationId);

    return await this.doorRepository.find({ where: { location: location } });
  }

  async getByIdsAndLocation(
    ids: number[],
    location: Location,
  ): Promise<Door[]> {
    const uniqueIds = Array.from(new Set(ids));
    const doors = await this.doorRepository.find({
      where: { id: In(uniqueIds), location: location },
    });

    if (!doors || doors.length != uniqueIds.length) {
      throw new EntityNotFoundException({
        locationId: location.id,
        doorIds: uniqueIds,
      });
    }

    return doors;
  }

  async getDoorPage(paginationDto: PaginationRequestDto) {
    const offset = paginationDto.page
      ? (paginationDto.page - 1) * paginationDto.limit
      : undefined;

    const [doorPage, total] = await this.doorRepository.findAndCount({
      relations: ['location', 'zones'],
      order: { name: 'ASC' },
      take: paginationDto.limit,
      skip: offset,
    });

    const result = [];

    doorPage.forEach((door) => {
      const { location, zones, ...rest } = door;

      rest['location'] = location.name;
      rest['zones'] = zones.length;

      result.push(rest);
    });

    return {
      doors: result,
      total,
    };
  }

  async updateDoor(updateDto: UpdateDoorDto) {
    const door = await this.getById(updateDto.id, [
      'holidays',
      'holidays.holiday',
      'holidays.timetables',
      'timetables',
    ]);
    const { timetables, ...rest } = updateDto;

    if (rest.name && rest.name !== door.name) {
      await this.throwIfNameAlreadyTaken(rest.name);
    }

    if (rest.holidays) {
      if (rest.holidays.length) {
        const holidayIds = rest.holidays.map((holiday) => holiday.holidayId);

        await this.holidayService.validateIds(holidayIds);
      }

      await this.holidayTimetableService.removeAll(
        door.holidays
          .map((holiday) => holiday.timetables)
          .reduce((prev, next) => prev.concat(next), []),
      );
      await this.doorHolidayService.removeAll(door.holidays);
    }

    if (timetables) {
      await this.doorTimetableService.removeAllForDoor(door.id);

      if (timetables.length) {
        rest['timetables'] =
          this.scheduleService.prepareUpdatedTimetables(timetables);
      }
    }

    return await this.doorRepository.save(rest);
  }

  async getById(doorId: number, relations: string[] = undefined) {
    const door = await this.doorRepository.findOne(doorId, {
      relations: relations,
    });

    if (!door) {
      throw new EntityNotFoundException({ doorId: doorId });
    }

    return door;
  }

  async throwIfNameAlreadyTaken(name: string) {
    if (await this.findByName(name)) {
      throw new EntityAlreadyExistsException({ name: name });
    }
  }

  async findByName(name: string) {
    return await this.doorRepository.findOne({ where: { name: name } });
  }

  async testDoor(doorId: number) {
    const door = await this.getById(doorId);
    const statusKeys = Object.keys(TypeDoorStatus);
    const statusIndex = Math.floor(Math.random() * statusKeys.length);

    door.status = TypeDoorStatus[statusKeys[statusIndex]];

    return await this.doorRepository.save(door);
  }

  async getDoorInfo(doorId: number) {
    const door = await this.doorRepository
      .createQueryBuilder('door')
      .select(['door.id', 'door.name'])
      .leftJoinAndSelect('door.holidays', 'holidays')
      .leftJoinAndSelect('holidays.holiday', 'holiday')
      .leftJoinAndSelect('holidays.timetables', 'holidays.timetables')
      .leftJoinAndSelect('door.timetables', 'timetables')
      .where('door.id = :doorId', { doorId })
      .getOne();

    if (!door) {
      throw new EntityNotFoundException({ doorId });
    }

    const { timetables, holidays, ...rest } = door;

    rest['holidays'] = this.scheduleService.prepareHolidaysOutput(holidays);

    rest['timetables'] =
      this.scheduleService.prepareTimetablesOutput(timetables);

    return rest;
  }
}
