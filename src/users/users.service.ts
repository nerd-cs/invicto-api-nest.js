import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['roles'],
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

  async createUser(userDto: CreateUserDto) {
    const { role, ...user } = userDto;
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existingUser) {
      throw new EntityAlreadyExistsException({ email: userDto.email });
    }
    const roleEntity = await this.roleService.getRoleByName(role);
    if (roleEntity) {
      user['roles'] = [roleEntity];
    }
    const savedUser = await this.userRepository.save(user);
    const { id, email, fullName, phoneNumber, allowSso } = savedUser;
    const roles = savedUser.roles.map((role) => role.value);
    return { id, email, fullName, phoneNumber, allowSso, roles };
  }

  async updateUser(userData: User) {
    return await this.userRepository.save(userData);
  }

  sanitizeUserInfo(user: User) {
    const { id, fullName, email, profilePicture, roles } = user;
    const plainRoles = roles.map((role) => role.value);
    const picture = profilePicture?.toString('base64') || null;
    return { id, fullName, email, profilePicture: picture, roles: plainRoles };
  }
}
