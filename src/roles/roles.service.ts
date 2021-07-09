import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, TypeRole } from './roles.model';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async getRoleByName(name: TypeRole) {
    return await this.roleRepository.findOne({ where: { value: name } });
  }
}
