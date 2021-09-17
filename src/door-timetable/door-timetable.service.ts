import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoorTimetable } from './door-timetable.model';

@Injectable()
export class DoorTimetableService {
  constructor(
    @InjectRepository(DoorTimetable)
    private readonly doorTimetableRepository: Repository<DoorTimetable>,
  ) {}

  async removeAllForDoor(doorId: number) {
    await this.doorTimetableRepository.delete({ doorId });
  }
}
