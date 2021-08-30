import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessGroupScheduleZone } from './access-group-schedule-zone.model';

@Injectable()
export class AccessGroupScheduleZoneService {
  constructor(
    @InjectRepository(AccessGroupScheduleZone)
    private readonly accessGroupScheduleZoneRepository: Repository<AccessGroupScheduleZone>,
  ) {}

  async removeAll(accessGroupScheduleZones: AccessGroupScheduleZone[]) {
    if (!accessGroupScheduleZones || !accessGroupScheduleZones.length) {
      return [];
    }

    return await this.accessGroupScheduleZoneRepository.remove(
      accessGroupScheduleZones,
    );
  }
}
