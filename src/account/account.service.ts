import { Injectable } from '@nestjs/common';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { User } from '../users/users.model';
import { SALT_LENGTH, UsersService } from '../users/users.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountService {
  constructor(private readonly userService: UsersService) {}

  async getAccountInfo(user: Express.User) {
    const userEntity = await this.userService.getById(user['id'], [
      'companies',
      'companies.company',
    ]);

    return this.prepareOutput(userEntity);
  }

  async updateAccount(dto: UpdateAccountDto, user: Express.User) {
    const userEntity = await this.userService.getById(user['id']);

    if (dto.profilePicture) {
      userEntity.profilePicture = this.userService.preparePicture(
        dto.profilePicture,
      );
    }

    if (dto.oldPassword && dto.newPassword) {
      if (dto.oldPassword === dto.newPassword) {
        throw new ConstraintViolationException('Passwords are the same');
      }

      if (!(await bcrypt.compare(dto.oldPassword, userEntity.password))) {
        throw new ConstraintViolationException('Invalid old password');
      }

      userEntity.password = await bcrypt.hash(dto.newPassword, SALT_LENGTH);
    }

    userEntity.fullName = dto.fullName || userEntity.fullName;
    userEntity.jobTitle = dto.jobTitle || userEntity.jobTitle;
    userEntity.city = dto.city || userEntity.city;
    userEntity.country = dto.country || userEntity.country;
    userEntity.email = dto.email || userEntity.email;
    userEntity.phoneNumber = dto.phoneNumber || userEntity.phoneNumber;

    return this.prepareOutput(await this.userService.updateUser(userEntity));
  }

  async deleteAccount(user: Express.User) {
    return this.userService.deleteById(user['id']);
  }

  private prepareOutput(user: User) {
    return {
      fullName: user.fullName,
      profilePicture: this.userService.prepareProfilePicture(
        user.profilePicture,
      ),
      jobTitle: user.jobTitle,
      company: user.companies?.find((wrapper) => wrapper.isMain).company,
      city: user.city,
      country: user.country,
      email: user.email,
      phoneNumber: user.phoneNumber,
      twoStepAuth: user.twoStepAuth,
    };
  }
}
