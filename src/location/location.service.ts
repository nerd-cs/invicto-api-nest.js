import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { Location } from '../location/location.model';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async getAllForCompany(user: Express.User): Promise<Location[]> {
    const companyId = user['company']['id'];

    return await this.locationRepository.find({
      where: { company: { id: companyId } },
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
