import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DoorService } from '../door/door.service';
import { LocationService } from '../location/location.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { Zone } from './zone.model';
import { Location } from '../location/location.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { AccessGroupScheduleZoneService } from '../access-group-schedule-zone/access-group-schedule-zone.service';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';

@Injectable()
export class ZoneService {
  constructor(
    @InjectRepository(Zone) private readonly zoneRepository: Repository<Zone>,
    private readonly locationService: LocationService,
    private readonly doorService: DoorService,
    private readonly accessGroupScheduleZoneService: AccessGroupScheduleZoneService,
  ) {}

  async getAllForLocation(locationId: number) {
    const location = await this.locationService.getById(locationId);

    return await this.zoneRepository.find({
      where: { location: location },
      relations: ['doors', 'childZones'],
    });
  }

  async getZonesPage(paginationDto: PaginationRequestDto, user: Express.User) {
    const locations = await this.locationService.getAllForCompany(user);
    const locationIds = locations.map((location) => location.id);
    const offset = (paginationDto.page - 1) * paginationDto.limit;

    return await this.zoneRepository.find({
      relations: ['location', 'doors', 'childZones'],
      where: { location: { id: In(locationIds) } },
      order: { name: 'ASC' },
      take: paginationDto.limit,
      skip: offset,
    });
  }

  async createZone(zoneDto: CreateZoneDto) {
    return this.zoneRepository.save(await this.validateCreateDto(zoneDto));
  }

  async createZones(dto: CreateZoneDto[]) {
    const prepared = [];

    for (let i = 0; i < dto.length; i++) {
      prepared.push(await this.validateCreateDto(dto[i]));
    }

    return await this.zoneRepository.save(prepared);
  }

  private async validateCreateDto(dto: CreateZoneDto) {
    const { doorIds, zoneIds, locationId, ...restZoneAttributes } = dto;

    await this.throwIfNameAlreadyTaken(dto.name);

    const location = await this.locationService.getById(locationId);

    restZoneAttributes['location'] = location;

    if (zoneIds && zoneIds.length) {
      restZoneAttributes['childZones'] = await this.getByIdsAndLocation(
        zoneIds,
        location,
      );
    }

    if (doorIds && doorIds.length) {
      restZoneAttributes['doors'] = await this.doorService.getByIdsAndLocation(
        doorIds,
        location,
      );
    }

    return restZoneAttributes;
  }

  async throwIfNameAlreadyTaken(name: string) {
    if (await this.findByName(name)) {
      throw new EntityAlreadyExistsException({ name: name });
    }
  }

  async findByName(name: string) {
    return await this.zoneRepository.findOne({ where: { name: name } });
  }

  async getByIdsAndLocation(
    ids: number[],
    location: Location,
  ): Promise<Zone[]> {
    const uniqueIds = Array.from(new Set(ids));
    const zones = await this.zoneRepository.find({
      where: { id: In(uniqueIds), location: location },
    });

    if (!zones || zones.length != uniqueIds.length) {
      throw new EntityNotFoundException({
        locationId: location.id,
        zoneIds: uniqueIds,
      });
    }

    return zones;
  }

  async getByIds(ids: number[]): Promise<Zone[]> {
    const uniqueIds = Array.from(new Set(ids));
    const zones = await this.zoneRepository.findByIds(uniqueIds, {
      relations: ['location'],
    });

    if (!zones || zones.length != uniqueIds.length) {
      throw new EntityNotFoundException({
        zoneIds: uniqueIds,
      });
    }

    return zones;
  }

  async updateZone(zoneDto: UpdateZoneDto) {
    const zone = await this.getById(zoneDto.id, [
      'location',
      'doors',
      'childZones',
    ]);

    if (zoneDto.name && zoneDto.name !== zone.name) {
      await this.throwIfNameAlreadyTaken(zoneDto.name);
      zone.name = zoneDto.name;
    }

    zone.description = zoneDto.description || zone.description;

    if (zoneDto.doorIds) {
      if (zoneDto.doorIds.length) {
        const doors = await this.doorService.getByIdsAndLocation(
          zoneDto.doorIds,
          zone.location,
        );

        zone.doors = doors;
      } else {
        zone.doors = [];
      }
    }

    if (zoneDto.zoneIds) {
      const selfIndex = zoneDto.zoneIds.indexOf(zone.id);

      if (selfIndex !== -1) {
        zoneDto.zoneIds.splice(selfIndex, 1);
      }

      if (zoneDto.zoneIds.length) {
        const zones = await this.getByIdsAndLocation(
          zoneDto.zoneIds,
          zone.location,
        );

        zone.childZones = zones;
      } else {
        zone.childZones = [];
      }
    }

    return await this.zoneRepository.save(zone);
  }

  async deleteZone(zoneId: number) {
    const zone = await this.getById(zoneId, ['accessGroupScheduleZones']);

    await this.accessGroupScheduleZoneService.removeAll(
      zone.accessGroupScheduleZones,
    );

    return await this.zoneRepository.remove(zone);
  }

  async getById(zoneId: number, relations: string[]) {
    const zone = await this.zoneRepository.findOne(zoneId, {
      relations: relations,
    });

    if (!zone) {
      throw new EntityNotFoundException({ zoneId: zoneId });
    }

    return zone;
  }
}
