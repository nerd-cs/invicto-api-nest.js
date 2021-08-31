import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { User } from '../users/users.model';
import { UserAccessGroup } from './user-access-group.model';

@Injectable()
export class UserAccessGroupService {
  constructor(
    @InjectRepository(UserAccessGroup)
    private readonly userAccessGroupRepository: Repository<UserAccessGroup>,
  ) {}

  async updateActiveness(group: UserAccessGroup, isActive: boolean) {
    if ((group.isActive && isActive) || (!group.isActive && !isActive)) {
      throw new ConstraintViolationException('Activeness is the same');
    }

    group.isActive = isActive;

    return await this.userAccessGroupRepository.save(group);
  }

  async unlinkAccessGroup(accessGroup: UserAccessGroup) {
    return await this.userAccessGroupRepository.remove(accessGroup);
  }

  async removeAllForUser(user: User) {
    return await this.userAccessGroupRepository.remove(user.accessGroups);
  }

  async removeAll(userAccessGroups: UserAccessGroup[]) {
    if (!userAccessGroups || !userAccessGroups.length) {
      return [];
    }

    return await this.userAccessGroupRepository.remove(userAccessGroups);
  }
}
