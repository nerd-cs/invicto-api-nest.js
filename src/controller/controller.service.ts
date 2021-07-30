import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { Controller, TypeControllerStatus } from './controller.model';
import { UpdateControllerDto } from './dto/update-controller.dto';

@Injectable()
export class ControllerService {
  constructor(
    @InjectRepository(Controller)
    private readonly controllerRepository: Repository<Controller>,
  ) {}

  async getControllerPage(paginationDto: PaginationRequestDto) {
    const offset = (paginationDto.page - 1) * paginationDto.limit;

    const controllerPage = await this.controllerRepository.find({
      relations: ['location', 'location.doors'],
      order: { name: 'ASC' },
      take: paginationDto.limit,
      skip: offset,
    });

    const result = [];

    controllerPage.forEach((controller) => {
      const { location, ...rest } = controller;

      rest['location'] = location.name;
      rest['doors'] = location.doors.length;

      result.push(rest);
    });

    return result;
  }

  async updateController(updateDto: UpdateControllerDto) {
    const controller = await this.getById(updateDto.id);

    if (updateDto.name !== controller.name) {
      await this.throwIfNameAlreadyTaken(updateDto.name);
      controller.name = updateDto.name;

      return await this.controllerRepository.save(controller);
    }
  }

  async getById(controllerId: number) {
    const controller = await this.controllerRepository.findOne(controllerId);

    if (!controller) {
      throw new EntityNotFoundException({ controllerId: controllerId });
    }

    return controller;
  }

  async throwIfNameAlreadyTaken(name: string) {
    if (await this.findByName(name)) {
      throw new EntityAlreadyExistsException({ name: name });
    }
  }

  async findByName(name: string) {
    return await this.controllerRepository.findOne({ where: { name: name } });
  }

  async testController(controllerId: number) {
    const controller = await this.getById(controllerId);
    const statusKeys = Object.keys(TypeControllerStatus);
    const statusIndex = Math.floor(Math.random() * statusKeys.length);

    controller.status = TypeControllerStatus[statusKeys[statusIndex]];

    return await this.controllerRepository.save(controller);
  }
}
