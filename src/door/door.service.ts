import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LocationService } from '../location/location.service';
import { Location } from '../location/location.model';
import { Door } from './door.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';

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
}
