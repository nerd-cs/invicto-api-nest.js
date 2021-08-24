import { Injectable } from '@nestjs/common';
import { TypeUserStatus, User } from './users.model';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { AccessGroupService } from 'src/access-group/access-group.service';
import { AssignLocationDto } from './dto/assign-location.dto';
import { MailService } from '../mail/mail.service';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { TokenService } from '../token/token.service';
import { InvalidTokenException } from '../exception/invalid-token.exception';
import * as bcrypt from 'bcryptjs';
import { InvalidInvitationException } from '../exception/invalid-invitation.exception';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PendingInvitationException } from '../exception/pending-invitation.exception';
import { UserPaginationRequestDto } from '../pagination/user-pagination-request.dto';
import { TypeRole } from '../roles/roles.model';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { CardService } from '../card/card.service';
import { UserAccessGroup } from '../user-access-group/user-access-group.model';
import { LocationService } from '../location/location.service';
import { Card } from '../card/card.model';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateAccessGroupsDto } from './dto/update-user-access-groups.dto';
import { ChangeActivenessDto } from './dto/change-activeness.dto';
import { UserAccessGroupService } from '../user-access-group/user-access-group.service';
import { UpdateUserCardDto as UpdateUserCardDto } from './dto/update-user-card.dto';
import { CreateUserCardsDto } from './dto/create-user-cards.dto';

export const SALT_LENGTH = 10;
export const BASE_64_PREFIX = 'data:image/jpg;base64,';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
    private readonly accessGroupService: AccessGroupService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly cardService: CardService,
    private readonly locationService: LocationService,
    private readonly userAccessGroupService: UserAccessGroupService,
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.findByEmail(email, ['roles', 'company']);

    if (!user) {
      throw new EntityNotFoundException({ email: email });
    }

    return user;
  }

  async findByEmail(email: string, relations: string[] = undefined) {
    return await this.userRepository.findOne({
      where: { email: email },
      relations: relations,
    });
  }

  async getAll(user: Express.User) {
    return await this.userRepository
      .find({
        relations: ['roles'],
        where: {
          company: user['company'],
          status: Not(TypeUserStatus.ARCHIVED),
        },
      })
      .then((users) => users.map(this.sanitizeUserInfo.bind(this)));
  }

  async getUsersPage(
    user: Express.User,
    paginationDto: UserPaginationRequestDto,
  ) {
    const offset = (paginationDto.page - 1) * paginationDto.limit;

    return paginationDto.role
      ? this.getUsersPageWithPermissions(
          offset,
          paginationDto.limit,
          user,
          paginationDto.role,
        )
      : this.getUsersPageWithAccessGroups(offset, paginationDto.limit, user);
  }

  private async getUsersPageWithPermissions(
    offset: number,
    limit: number,
    user: Express.User,
    role: TypeRole,
  ) {
    const page = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('company.id = :companyId', { companyId: user['company']['id'] })
      .andWhere('roles.value = :role', { role })
      .andWhere('user.status != :status', { status: TypeUserStatus.ARCHIVED })
      .skip(offset)
      .take(limit)
      .getMany();

    const result = [];

    page.forEach((user) => {
      const sanitized = this.sanitizeUserInfo(user);
      const { company, ...rest } = sanitized;

      rest['lastActivity'] = new Date();

      if (rest.roles.includes(TypeRole.ADMIN)) {
        rest['permissions'] = 'All permissions';
      }

      result.push(rest);
    });

    return result;
  }

  private async getUsersPageWithAccessGroups(
    offset: number,
    limit: number,
    user: Express.User,
  ) {
    const page = await this.userRepository.find({
      where: { company: user['company'], status: Not(TypeUserStatus.ARCHIVED) },
      relations: ['accessGroups', 'accessGroups.accessGroup', 'roles'],
      take: limit,
      skip: offset,
      order: { fullName: 'ASC' },
    });

    const result = [];

    page.forEach((user) => {
      const accessGroups = user.accessGroups
        .map((wrapper) => wrapper.accessGroup)
        .map((accessGroup) => accessGroup.name);
      const sanitized = this.sanitizeUserInfo(user);
      const { company, ...rest } = sanitized;

      rest['accessGroups'] = accessGroups;
      rest['lastActivity'] = new Date();

      result.push(rest);
    });

    return result;
  }

  async getUserInfo(userId: number, admin: Express.User) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.accessGroups', 'accessGroups')
      .leftJoinAndSelect('accessGroups.accessGroup', 'accessGroup')
      // .leftJoinAndSelect('accessGroup.location', 'location') // TODO
      .leftJoinAndSelect('accessGroup.zoneSchedules', 'zoneSchedules')
      .leftJoinAndSelect('zoneSchedules.zone', 'zone')
      .leftJoinAndSelect('user.updatedBy', 'updatedBy')
      .leftJoinAndSelect('user.cards', 'cards')
      .where('user.id = :userId', { userId })
      .andWhere('user.company_id = :companyId', {
        companyId: admin['company']['id'],
      })
      .getOne();

    if (!user) {
      throw new EntityNotFoundException({ userId: userId });
    }

    const sanitized = this.sanitizeUserInfo(user);

    return {
      id: user.id,
      profilePicture: this.prepareProfilePicture(user.profilePicture),
      fullName: user.fullName,
      company: user.company.name,
      roles: sanitized.roles,
      status: user.status,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy?.fullName,
      department: user.department,
      phoneNumber: user.phoneNumber,
      employeeNumber: user.employeeNumber,
      accessGroups: await this.prepareAccessGroupsOutput(
        user.accessGroups,
        admin,
      ),
      cards: this.prepareCardsOutput(user.cards),
    };
  }

  private async prepareAccessGroupsOutput(
    userAccessGroups: UserAccessGroup[],
    admin: Express.User,
  ) {
    const result = [];

    if (!userAccessGroups || !userAccessGroups.length) {
      return [];
    }

    const locations = await this.locationService.getAllForCompany(admin);
    const locationsMap = locations.reduce(function (map, location) {
      map[location.id] = location;

      return map;
    }, {});

    userAccessGroups.forEach((wrapper) => {
      const accessGroup = {
        id: wrapper.accessGroup.id,
        isActive: wrapper.isActive,
        name: wrapper.accessGroup.name,
        location: locationsMap[wrapper.accessGroup.locationId],
        lastActivity: new Date(),
        zones: wrapper.accessGroup.zoneSchedules
          .map((zoneSchedule) => zoneSchedule.zone)
          .map((zone) => zone.name),
      };

      result.push(accessGroup);
    });

    return result;
  }

  private prepareCardsOutput(cards: Card[]) {
    if (!cards || !cards.length) {
      return [];
    }

    const result = [];

    cards.forEach((card) => {
      const { createdAt, ...rest } = card;

      rest['lastActivity'] = new Date();
      rest['createdAt'] = createdAt;

      result.push(rest);
    });

    return result;
  }

  async createUser(userDto: CreateUserDto, admin: Express.User) {
    const { role, locations, cards, instantlyInvite, ...restUserAttributes } =
      userDto;

    await this.throwIfEmailAlreadyTaken(userDto.email);

    const roleEntity = await this.roleService.getRoleByName(role);

    if (roleEntity) {
      restUserAttributes['roles'] = [roleEntity];
    }

    restUserAttributes['status'] = instantlyInvite
      ? TypeUserStatus.PENDING
      : TypeUserStatus.INCOMPLETE;
    restUserAttributes['company'] = admin['company'];
    await this.validateAndAssignAccessGroups(restUserAttributes, locations);

    if (cards) {
      restUserAttributes['cards'] = cards;
    }

    const savedUser = await this.userRepository.save(restUserAttributes);

    const { id, email, fullName, phoneNumber, allowSso } = savedUser;

    const roles = savedUser.roles.map((role) => role.value);

    if (instantlyInvite) {
      this.sendInvitation(savedUser);
    }

    return { id, email, fullName, phoneNumber, allowSso, roles };
  }

  private async throwIfEmailAlreadyTaken(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existingUser) {
      throw new EntityAlreadyExistsException({ email: email });
    }
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

    const userAccessGroups: UserAccessGroup[] = [];

    accessGroups.forEach((accessGroup) => {
      userAccessGroups.push({
        userId: user['id'],
        user: user,
        accessGroup: accessGroup,
        isActive: true,
        accessGroupId: accessGroup.id,
      });
    });

    user['accessGroups'] = userAccessGroups;
  }

  async updateUser(userData: User) {
    return await this.userRepository.save(userData); // TODO only updated fields
  }

  sanitizeUserInfo(user: User) {
    const {
      id,
      fullName,
      email,
      profilePicture,
      roles,
      status,
      company,
      phoneNumber,
      twoStepAuth,
    } = user;

    const plainRoles = roles?.map((role) => role.value);

    const picture = this.prepareProfilePicture(profilePicture);

    return {
      id,
      fullName,
      email,
      profilePicture: picture,
      roles: plainRoles,
      status,
      company,
      phoneNumber,
      twoStepAuth,
    };
  }

  prepareProfilePicture(profilePicture: Buffer) {
    return profilePicture
      ? `${BASE_64_PREFIX}${profilePicture.toString('base64')}`
      : null;
  }

  async inviteUser(userId: number) {
    const user = await this.getById(userId, ['accessGroups']);

    if (user.status === TypeUserStatus.ACTIVE) {
      throw new InvalidInvitationException('Email already confirmed');
    }

    if (user.status === TypeUserStatus.PENDING) {
      throw new InvalidInvitationException('Invitation already sent');
    }

    await this.sendInvitation(user);

    user.status = TypeUserStatus.PENDING;
    await this.userRepository.save(user);
  }

  async createCollaborator(
    dto: CreateCollaboratorDto,
    admin: Express.User,
    originHeader: string,
  ) {
    const { role, ...rest } = dto;

    await this.throwIfEmailAlreadyTaken(dto.email);

    const roleEntity = await this.roleService.getRoleByName(role);

    if (roleEntity) {
      rest['roles'] = [roleEntity];
    }

    rest['status'] = TypeUserStatus.PENDING;
    rest['company'] = admin['company'];

    const savedUser = await this.userRepository.save(rest);

    this.sendEmailConfirmation(savedUser, originHeader);

    return this.sanitizeUserInfo(savedUser);
  }

  private async sendInvitation(user: User) {
    const accessGroups = user.accessGroups
      .map((wrapper) => wrapper.accessGroup)
      .map((group) => group.name)
      .join(', ');

    this.mailService.sendInvitation(user, accessGroups);
  }

  private async sendEmailConfirmation(user: User, originHeader: string) {
    const token = await this.tokenService.createToken(user);

    this.mailService.sendEmailConfirmation(token, originHeader);
  }

  async completeRegistration(dto: CompleteRegistrationDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.tokens',
        'tokens',
        'tokens.value = :tokenValue',
        { tokenValue: dto.token },
      )
      .leftJoinAndSelect('user.roles', 'roles')
      .where('tokens.value = :tokenValue', { tokenValue: dto.token })
      .getOne();

    if (!user) {
      throw new InvalidTokenException('Invalid confirmation token');
    }

    const now = new Date();
    const { tokens, ...rest } = user;
    const token = tokens[0];

    if (token.validThrough < now) {
      rest.status = TypeUserStatus.INCOMPLETE;
      this.userRepository.save(rest);
      this.tokenService.removeByValue(token.value);
      throw new InvalidTokenException('Confirmation token is expired');
    }

    this.tokenService.removeByValue(token.value);
    rest.status = TypeUserStatus.ACTIVE;
    rest.password = await bcrypt.hash(dto.password, SALT_LENGTH);

    return this.sanitizeUserInfo(await this.userRepository.save(rest));
  }

  async getById(
    userId: number,
    relations: string[] = undefined,
    where: Record<string, unknown> = undefined,
  ) {
    const user = await this.userRepository.findOne(userId, {
      relations: relations,
      where: where,
    });

    if (!user) {
      throw new EntityNotFoundException({ userId: userId });
    }

    return user;
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
    originHeader: string,
  ) {
    const user = await this.findByEmail(resetPasswordDto.email);

    if (!user) {
      return;
    }

    if (user.status === TypeUserStatus.PENDING) {
      throw new PendingInvitationException();
    }

    this.sendPasswordReset(user, originHeader);
  }

  async resetPasswordForUser(userId: number, originHeader: string) {
    const user = await this.getById(userId);

    if (user.status === TypeUserStatus.PENDING) {
      throw new PendingInvitationException();
    }

    this.sendPasswordReset(user, originHeader);
  }

  private async sendPasswordReset(user: User, origin: string) {
    const token = await this.tokenService.createToken(user);

    this.mailService.sendPasswordReset(token, origin);
  }

  async confirmPassword(confirmPasswordDto: CompleteRegistrationDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.tokens',
        'tokens',
        'tokens.value = :tokenValue',
        { tokenValue: confirmPasswordDto.token },
      )
      .leftJoinAndSelect('user.roles', 'roles')
      .where('tokens.value = :tokenValue', {
        tokenValue: confirmPasswordDto.token,
      })
      .getOne();

    if (!user) {
      throw new InvalidTokenException('Invalid confirmation token');
    }

    const now = new Date();
    const { tokens, ...rest } = user;
    const token = tokens[0];

    if (token.validThrough < now) {
      this.tokenService.removeByValue(token.value);
      throw new InvalidTokenException('Confirmation token is expired');
    }

    this.tokenService.removeByValue(token.value);
    rest.password = await bcrypt.hash(confirmPasswordDto.password, SALT_LENGTH);

    return this.sanitizeUserInfo(await this.userRepository.save(rest));
  }

  async deleteById(id: number) {
    const user = await this.getById(id, ['tokens', 'cards', 'accessGroups']);

    await this.tokenService.removeAll(user.tokens);
    await this.cardService.removeAll(user.cards);
    await this.userAccessGroupService.removeAllForUser(user);

    return this.sanitizeUserInfo(await this.userRepository.remove(user));
  }

  async changeUserStatus(
    userId: number,
    admin: Express.User,
    dto: ChangeUserStatusDto,
  ) {
    const user = await this.getById(userId, undefined, {
      company: admin['company'],
    });

    const newStatus = TypeUserStatus[dto.status];

    if (user.status === newStatus) {
      throw new ConstraintViolationException('Status is the same');
    }

    user.status = newStatus;

    return this.sanitizeUserInfo(await this.userRepository.save(user));
  }

  async updateUserInfo(dto: UpdateUserDto, admin: Express.User) {
    const user = await this.getById(dto.id, undefined, {
      company: admin['company'],
    });

    if (dto.email && dto.email !== user.email) {
      await this.throwIfEmailAlreadyTaken(dto.email);
      user.email = dto.email;
    }

    if (dto.profilePicture) {
      user.profilePicture = this.preparePicture(dto.profilePicture);
    } else if (dto.profilePicture === null) {
      user.profilePicture = null;
    }

    if (dto.role) {
      user.roles = [await this.roleService.getRoleByName(dto.role)];
    }

    user.fullName = dto.fullName || user.fullName;
    user.status = dto.status ? TypeUserStatus[dto.status] : user.status;
    user.phoneNumber = dto.phoneNumber || user.phoneNumber;
    user.employeeNumber = dto.employeeNumber || user.employeeNumber;
    user.department = dto.department || user.department;

    return this.sanitizeUserInfo(await this.updateUser(user));
  }

  preparePicture(picture: string) {
    return Buffer.from(picture.replace(BASE_64_PREFIX, ''), 'base64');
  }

  async getUserAccessGroups(userId: number, admin: Express.User) {
    const user = await this.getById(userId, undefined, {
      company: admin['company'],
    });

    return await this.accessGroupService.getAllForUser(user);
  }

  async changeAccessGroupActiveness(
    userId: number,
    accessGroupId: number,
    admin: Express.User,
    dto: ChangeActivenessDto,
  ) {
    const user = await this.getUserByIdAndAccessGroup(
      userId,
      accessGroupId,
      admin,
    );

    return await this.userAccessGroupService.updateActiveness(
      user.accessGroups[0],
      dto.isActive,
    );
  }

  async unlinkUserAccessGroup(
    userId: number,
    accessGroupId: number,
    admin: Express.User,
  ) {
    const user = await this.getUserByIdAndAccessGroup(
      userId,
      accessGroupId,
      admin,
    );

    return await this.userAccessGroupService.unlinkAccessGroup(
      user.accessGroups[0],
    );
  }

  private async getUserByIdAndAccessGroup(
    userId: number,
    accessGroupId: number,
    admin: Express.User,
  ) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.accessGroups',
        'accessGroups',
        'accessGroups.accessGroupId = :accessGroupId',
        { accessGroupId: accessGroupId },
      )
      .leftJoin('user.company', 'company')
      .where('user.id = :userId', { userId })
      .andWhere('company.id = :companyId', {
        companyId: admin['company']['id'],
      })
      .getOne();

    if (!user) {
      throw new EntityNotFoundException({ userId });
    }

    if (!user.accessGroups || !user.accessGroups.length) {
      throw new EntityNotFoundException({ accessGroupId });
    }

    return user;
  }

  async updateUserAccessGroups(
    userId: number,
    admin: Express.User,
    dto: UpdateAccessGroupsDto,
  ) {
    const user = await this.getById(userId, ['accessGroups'], {
      company: admin['company'],
    });

    await this.userAccessGroupService.removeAllForUser(user);
    await this.validateAndAssignAccessGroups(user, dto.locations);

    const saved = await this.userRepository.save({
      id: userId,
      accessGroups: user.accessGroups,
    });

    return {
      id: saved.id,
      accessGroups: saved.accessGroups
        .map((wrapper) => wrapper.accessGroup)
        .reduce((prev, accessGroup) => prev.concat(accessGroup), []),
    };
  }

  async updateUserCards(
    userId: number,
    admin: Express.User,
    dto: UpdateUserCardDto,
  ) {
    const user = await this.getByIdAndCardId(userId, dto.id, admin);

    return await this.cardService.updateCard(user.cards[0], dto);
  }

  async changeCardActiveness(
    userId: number,
    cardId: number,
    admin: Express.User,
    dto: ChangeActivenessDto,
  ) {
    const user = await this.getByIdAndCardId(userId, cardId, admin);

    return await this.cardService.updateActiveness(user.cards[0], dto.isActive);
  }

  async deleteUserCard(userId: number, cardId: number, admin: Express.User) {
    const user = await this.getByIdAndCardId(userId, cardId, admin);

    return this.cardService.deleteCard(user.cards[0]);
  }

  async createUserCards(
    userId: number,
    admin: Express.User,
    dto: CreateUserCardsDto,
  ) {
    const user = await this.getById(userId, ['cards'], {
      company: admin['company'],
    });

    return (await this.cardService.createCards(dto.cards, user)).map((card) => {
      const { user, ...rest } = card;

      return rest;
    });
  }

  private async getByIdAndCardId(
    userId: number,
    cardId: number,
    admin: Express.User,
  ) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.cards', 'cards', 'cards.id = :cardId', {
        cardId,
      })
      .leftJoin('user.company', 'company')
      .where('user.id = :userId', { userId })
      .andWhere('company.id = :companyId', {
        companyId: admin['company']['id'],
      })
      .getOne();

    if (!user) {
      throw new EntityNotFoundException({ userId });
    }

    if (!user.cards || !user.cards.length) {
      throw new EntityNotFoundException({ cardId });
    }

    return user;
  }
}
