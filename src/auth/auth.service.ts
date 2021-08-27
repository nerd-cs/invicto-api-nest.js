import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { BadCredentialsException } from '../exception/bad-credentials.exception';
import { HttpService } from '@nestjs/axios';
import { TypeUserStatus } from '../users/users.model';
import { PendingInvitationException } from '../exception/pending-invitation.exception';
import { DisabledAccountException } from '../exception/disabled-account.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(emailAddress: string, pwd: string) {
    const user = await this.userService.getUserByEmail(emailAddress);

    if (user.status === TypeUserStatus.PENDING) {
      throw new PendingInvitationException();
    }

    if (
      user.status === TypeUserStatus.INACTIVE ||
      user.status === TypeUserStatus.ARCHIVED
    ) {
      throw new DisabledAccountException();
    }

    const passwordCorrect = await bcrypt.compare(pwd, user.password || '');

    if (!passwordCorrect) {
      throw new BadCredentialsException();
    }

    return this.userService.sanitizeUserInfoAndIncludePermissions(user);
  }

  async validateOauthUser(emailAddress: string) {
    const user = await this.userService.getUserByEmail(emailAddress);

    if (
      user.status === TypeUserStatus.INACTIVE ||
      user.status === TypeUserStatus.ARCHIVED
    ) {
      throw new DisabledAccountException();
    }

    return this.userService.sanitizeUserInfoAndIncludePermissions(user);
  }

  async processGoogleData(userData: any) {
    const user = await this.userService.getUserByEmail(userData.email);

    user.fullName = userData.fullName;
    user.profilePicture = await this.getPicture(userData.profilePicture);
    const updated = await this.userService.updateUser(user);

    return this.userService.sanitizeUserInfo(updated);
  }

  async getPicture(url: string): Promise<Buffer> {
    const response = await this.httpService.axiosRef({
      url: url,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    return Buffer.from(response.data, 'base64');
  }
}
