import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { LocationService } from '../location/location.service';
import { AccessGroup } from './access-group.model';

@Injectable()
export class AccessGroupService {
  constructor(
    @InjectRepository(AccessGroup)
    private readonly accessGroupRepository: Repository<AccessGroup>,
    private readonly locationService: LocationService,
  ) {}

  async getAllByIds(ids: number[]): Promise<AccessGroup[]> {
    const uniqueIds = Array.from(new Set(ids));
    const accessGroups = await this.accessGroupRepository.findByIds(uniqueIds, {
      relations: ['location'],
    });

    if (!accessGroups || accessGroups.length < uniqueIds.length) {
      throw new EntityNotFoundException({ accessGroupIds: uniqueIds });
    }

    return accessGroups;
  }

  async getAllForLocation(locationId: number) {
    const location = await this.locationService.getById(locationId);

    return await this.accessGroupRepository.find({
      where: { location: location },
    });
  }
}
