import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessGroupScheduleZoneService } from '../access-group-schedule-zone/access-group-schedule-zone.service';
import { LinkScheduleZoneDto } from '../access-group-schedule-zone/dto/link-schedule-zone.dto';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { Location } from '../location/location.model';
import { LocationService } from '../location/location.service';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { UserAccessGroupService } from '../user-access-group/user-access-group.service';
import { User } from '../users/users.model';
import { ZoneService } from '../zone/zone.service';
import { AccessGroup } from './access-group.model';
import { CreateAccessGroupDto } from './dto/create-access-group.dto';
import { CreateCustomAccessDto } from './dto/create-custom-access.dto';
import { UpdateAccessGroupDto } from './dto/update-access-group.dto';

@Injectable()
export class AccessGroupService {
  constructor(
    @InjectRepository(AccessGroup)
    private readonly accessGroupRepository: Repository<AccessGroup>,
    private readonly locationService: LocationService,
    private readonly zoneService: ZoneService,
    private readonly scheduleService: ScheduleService,
    private readonly userAccessGroupService: UserAccessGroupService,
    private readonly accessGroupScheduleZoneService: AccessGroupScheduleZoneService,
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
      select: ['id', 'name'],
      where: { location: location },
    });
  }

  async createAccessGroup(createAccessGroupDto: CreateAccessGroupDto) {
    const { zoneSchedules, locationId, custom, ...rest } = createAccessGroupDto;
    const location = await this.locationService.getById(locationId);

    await this.throwIfNameAlreadyTaken(createAccessGroupDto.name);

    let mappings = [];

    if (zoneSchedules && zoneSchedules.length) {
      mappings = await this.processZoneSchedules(zoneSchedules, location);
    }

    if (custom && custom.length) {
      mappings = mappings.concat(
        await this.processCustomAccess(custom, location),
      );
    }

    rest['zoneSchedules'] = mappings;
    rest['location'] = location;

    return await this.accessGroupRepository.save(rest);
  }

  private async processZoneSchedules(
    dto: LinkScheduleZoneDto[],
    location: Location,
  ) {
    const zones = await this.zoneService.getByIdsAndLocation(
      dto.map((wrapper) => wrapper.zoneId),
      location,
    );
    const schedules = await this.scheduleService.getByIds(
      dto.map((wrapper) => wrapper.scheduleId),
    );

    const result = [];

    dto.forEach((scheduleZone) => {
      result.push({
        zoneId: scheduleZone.zoneId,
        scheduleId: scheduleZone.scheduleId,
      });
    });

    return result;
  }

  private async processCustomAccess(
    dtos: CreateCustomAccessDto[],
    location: Location,
  ) {
    const zoneDtos = dtos.map((wrapper) => wrapper.zone);
    const scheduleDtos = dtos.map((wrapper) => wrapper.schedule);

    this.validateNames(zoneDtos);
    this.validateNames(scheduleDtos);

    const zones = await this.zoneService.createZones(zoneDtos, location);
    const zonesMap = zones.reduce(function (map, zone) {
      map[zone.name] = zone;

      return map;
    }, {});

    const schedules = await this.scheduleService.createSchedules(scheduleDtos);
    const schedulesMap = schedules.reduce(function (map, schedule) {
      map[schedule.name] = schedule;

      return map;
    }, {});

    const zoneSchedules = [];

    dtos.forEach((dto) =>
      zoneSchedules.push({
        zoneId: zonesMap[dto.zone.name].id,
        scheduleId: schedulesMap[dto.schedule.name].id,
      }),
    );

    return zoneSchedules;
  }

  private validateNames(dto: unknown[]) {
    const names = [];

    dto.forEach((dto) => {
      const name = dto['name'];

      if (names.includes(name)) {
        throw new ConstraintViolationException('name should be unique');
      }

      names.push(name);
    });
  }

  async getAccessGroupsPage(paginationDto: PaginationRequestDto) {
    const offset = paginationDto.page
      ? (paginationDto.page - 1) * paginationDto.limit
      : undefined;

    const [accessGroupPage, total] = await this.accessGroupRepository
      .createQueryBuilder('access_group')
      .leftJoinAndSelect('access_group.users', 'users')
      .leftJoinAndSelect('access_group.location', 'location')
      .leftJoinAndSelect('access_group.zoneSchedules', 'zone_schedules')
      .leftJoinAndSelect('zone_schedules.zone', 'zone')
      .leftJoinAndSelect('zone_schedules.schedule', 'schedule')
      .orderBy('access_group.name', 'ASC')
      .skip(offset)
      .take(paginationDto.limit)
      .getManyAndCount();

    const page = [];

    accessGroupPage.forEach((accessGroup) => {
      const { users, zoneSchedules, locationId, ...rest } = accessGroup;

      rest['users'] = users.length;
      const preparedZoneSchedules = [];

      zoneSchedules.forEach((zoneSchedule) =>
        preparedZoneSchedules.push({
          zone: zoneSchedule.zone,
          schedule: zoneSchedule.schedule,
        }),
      );
      rest['zoneSchedules'] = preparedZoneSchedules;

      page.push(rest);
    });

    return {
      accessGroups: page,
      total,
    };
  }

  async updateAccessGroup(updateAccessGroupDto: UpdateAccessGroupDto) {
    const accessGroup = await this.getById(updateAccessGroupDto.id, [
      'zoneSchedules',
      'location',
    ]);

    const { zoneSchedules, ...rest } = updateAccessGroupDto;

    if (rest.name && rest.name !== accessGroup.name) {
      await this.throwIfNameAlreadyTaken(updateAccessGroupDto.name);
    }

    if (zoneSchedules) {
      if (!zoneSchedules.length) {
        await this.accessGroupScheduleZoneService.removeAll(
          accessGroup.zoneSchedules,
        );
      } else {
        const links = [];
        const zones = await this.zoneService.getByIdsAndLocation(
          zoneSchedules.map((wrapper) => wrapper.zoneId),
          accessGroup.location,
        );

        const schedules = await this.scheduleService.getByIds(
          zoneSchedules.map((wrapper) => wrapper.scheduleId),
        );

        zoneSchedules.forEach((zoneSchedule) => {
          links.push({
            zoneId: zoneSchedule.zoneId,
            scheduleId: zoneSchedule.scheduleId,
            accessGroupId: accessGroup.id,
          });
        });

        await this.accessGroupScheduleZoneService.removeAll(
          accessGroup.zoneSchedules,
        );
        rest['zoneSchedules'] = links;
      }
    }

    return await this.accessGroupRepository.save(rest);
  }

  async deleteAccessGroup(accessGroupId: number) {
    const accessGroup = await this.getById(accessGroupId, [
      'zoneSchedules',
      'users',
    ]);

    await this.accessGroupRepository
      .createQueryBuilder()
      .delete()
      .from('AccessGroupScheduleZone')
      .where('access_group_id = :accessGroupId', { accessGroupId })
      .execute();

    await this.userAccessGroupService.removeAll(accessGroup.users);

    return await this.accessGroupRepository.remove(accessGroup);
  }

  async getById(accessGroupId: number, relations: string[]) {
    const accessGroup = await this.accessGroupRepository.findOne(
      accessGroupId,
      {
        relations: relations,
      },
    );

    if (!accessGroup) {
      throw new EntityNotFoundException({ accessGroupId: accessGroupId });
    }

    return accessGroup;
  }

  async throwIfNameAlreadyTaken(name: string) {
    if (await this.findByName(name)) {
      throw new EntityAlreadyExistsException({ name: name });
    }
  }

  async findByName(name: string) {
    return await this.accessGroupRepository.findOne({ where: { name: name } });
  }

  async getAllForUser(user: User) {
    return await this.accessGroupRepository
      .createQueryBuilder('accessGroup')
      .select(
        'array_to_json(array_agg(json_build_object(\'id\', "accessGroup".id, \'name\', "accessGroup".name))) as "accessGroups"',
      )
      .addSelect('location.id as "locationId"')
      .addSelect('location.name as "locationName"')
      .leftJoin('accessGroup.location', 'location')
      .leftJoin('accessGroup.users', 'users')
      .where('users.userId = :userId', { userId: user.id })
      .groupBy('location.id')
      .execute();
  }
}
