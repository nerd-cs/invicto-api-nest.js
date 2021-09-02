import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { Location } from '../location/location.model';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async getAllForCompany(user: Express.User): Promise<Location[]> {
    const companyIds = user['companies'].map((wrapper) => wrapper.companyId);

    return await this.locationRepository.find({
      where: { company: { id: In(companyIds) } },
    });
  }

  async getById(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({ id: id });

    if (!location) {
      throw new EntityNotFoundException({ locationId: id });
    }

    return location;
  }
}
