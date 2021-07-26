import { Injectable } from '@nestjs/common';
import { TypeUserStatus, User } from './users.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { AccessGroupService } from 'src/access-group/access-group.service';
import { AssignLocationDto } from './dto/assign-location.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
    private readonly accessGroupService: AccessGroupService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['roles', 'company'],
    });

    if (!user) {
      throw new EntityNotFoundException({ email: email });
    }

    return user;
  }

  async getAll() {
    return await this.userRepository
      .find({ relations: ['roles'] })
      .then((users) => users.map(this.sanitizeUserInfo));
  }

  async createUser(userDto: CreateUserDto, admin: Express.User) {
    const { role, locations, cards, instantlyInvite, ...restUserAttributes } =
      userDto;

    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new EntityAlreadyExistsException({ email: userDto.email });
    }

    const roleEntity = await this.roleService.getRoleByName(role);

    if (roleEntity) {
      restUserAttributes['roles'] = [roleEntity];
    }

    restUserAttributes['status'] = TypeUserStatus.INCOMPLETE;
    restUserAttributes['company'] = admin['company'];
    await this.validateAndAssignAccessGroups(restUserAttributes, locations);

    if (cards) {
      restUserAttributes['cards'] = cards;
    }

    const savedUser = await this.userRepository.save(restUserAttributes);

    const { id, email, fullName, phoneNumber, allowSso } = savedUser;

    const roles = savedUser.roles.map((role) => role.value);

    return { id, email, fullName, phoneNumber, allowSso, roles };
  }

  private async validateAndAssignAccessGroups(
    user: any,
    locations: AssignLocationDto[],
  ): Promise<void> {
    const accessGroups = await this.accessGroupService.getAllByIds(
      locations
        .map((location) => location.accessGroupIds)
        .reduce((res, accessGroups) => res.concat(accessGroups)),
    ); // TODO validation: search by id and location id? check that each location belongs to admin's company?

    const locationIds = locations.map((location) => location.locationId);

    if (
      accessGroups.filter(
        (accessGroup) => !locationIds.includes(accessGroup.location.id),
      ).length
    ) {
      throw new EntityNotFoundException(locations);
    }

    user['accessGroups'] = accessGroups;
  }

  async updateUser(userData: User) {
    return await this.userRepository.save(userData); // TODO only updated fields
  }

  sanitizeUserInfo(user: User) {
    const { id, fullName, email, profilePicture, roles, status, company } =
      user;

    const plainRoles = roles.map((role) => role.value);

    const picture = profilePicture?.toString('base64') || null;

    return {
      id,
      fullName,
      email,
      profilePicture: picture,
      roles: plainRoles,
      status,
      company,
    };
  }
}
