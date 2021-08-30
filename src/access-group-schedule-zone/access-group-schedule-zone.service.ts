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
    return await this.accessGroupScheduleZoneRepository.remove(
      accessGroupScheduleZones,
    );
  }
}
