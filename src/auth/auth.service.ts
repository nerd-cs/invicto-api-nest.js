import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { BadCredentialsException } from '../exception/bad-credentials.exception';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(emailAddress: string, pwd: string) {
    const user = await this.userService.getUserByEmail(emailAddress);
    const passwordCorrect = await bcrypt.compare(pwd, user.password);
    if (!passwordCorrect) {
      throw new BadCredentialsException();
    }

    const { id, fullName, email, profilePicture, roles } = user;
    const plainRoles = roles.map((role) => role.value);
    return { id, fullName, email, profilePicture, roles: plainRoles };
  }
}
