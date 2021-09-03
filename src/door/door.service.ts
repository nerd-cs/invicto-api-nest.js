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

@Injectable()
export class DoorService {
  constructor(
    @InjectRepository(Door) private readonly doorRepository: Repository<Door>,
    private readonly locationService: LocationService,
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
    const door = await this.getById(updateDto.id);

    if (updateDto.name !== door.name) {
      await this.throwIfNameAlreadyTaken(updateDto.name);
      door.name = updateDto.name;

      return await this.doorRepository.save(door);
    }
  }

  async getById(doorId: number) {
    const door = await this.doorRepository.findOne(doorId);

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
}
