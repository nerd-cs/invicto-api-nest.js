import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { LocationService } from '../location/location.service';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { UserAccessGroupService } from '../user-access-group/user-access-group.service';
import { User } from '../users/users.model';
import { ZoneService } from '../zone/zone.service';
import { AccessGroup } from './access-group.model';
import { CreateAccessGroupDto } from './dto/create-access-group.dto';
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

  async createAccessGroup(createAccessGroupDto: CreateAccessGroupDto) {
    const { zoneSchedules, locationId, ...rest } = createAccessGroupDto;
    const location = await this.locationService.getById(locationId);

    await this.throwIfNameAlreadyTaken(createAccessGroupDto.name);

    rest['zoneSchedules'] = zoneSchedules;
    rest['location'] = location;

    return await this.accessGroupRepository.save(rest);
  }

  async getAccessGroupsPage(paginationDto: PaginationRequestDto) {
    const offset = (paginationDto.page - 1) * paginationDto.limit;

    const accessGroupPage = await this.accessGroupRepository
      .createQueryBuilder('access_group')
      .leftJoinAndSelect('access_group.users', 'users')
      .leftJoinAndSelect('access_group.zoneSchedules', 'zone_schedules')
      .leftJoinAndSelect('zone_schedules.zone', 'zone')
      .leftJoinAndSelect('zone_schedules.schedule', 'schedule')
      .orderBy('access_group.name', 'ASC')
      .skip(offset)
      .take(paginationDto.limit)
      .getMany();

    const page = [];

    accessGroupPage.forEach((accessGroup) => {
      const { users, zoneSchedules, ...rest } = accessGroup;

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

    return page;
  }

  async updateAccessGroup(updateAccessGroupDto: UpdateAccessGroupDto) {
    const accessGroup = await this.getById(updateAccessGroupDto.id, undefined);

    const { zoneSchedules, locationId, ...rest } = updateAccessGroupDto;

    if (rest.name && rest.name !== accessGroup.name) {
      await this.throwIfNameAlreadyTaken(updateAccessGroupDto.name);
    }

    if (zoneSchedules) {
      const links = [];

      zoneSchedules.forEach((zoneSchedule) => {
        links.push({
          zoneId: zoneSchedule.zoneId,
          scheduleId: zoneSchedule.scheduleId,
          accessGroupId: accessGroup.id,
        });
      });

      await this.accessGroupRepository
        .createQueryBuilder('access_group')
        .insert()
        .into('AccessGroupScheduleZone')
        .values(links)
        .execute();
    }

    if (locationId) {
      rest['location'] = await this.locationService.getById(locationId);
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
