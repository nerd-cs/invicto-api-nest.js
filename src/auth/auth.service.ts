import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { BadCredentialsException } from '../exception/bad-credentials.exception';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(emailAddress: string, pwd: string) {
    const user = await this.userService.getUserByEmail(emailAddress);
    const passwordCorrect = await bcrypt.compare(pwd, user.password);
    if (!passwordCorrect) {
      throw new BadCredentialsException();
    }

    return this.userService.sanitizeUserInfo(user);
  }

  async validateOauthUser(emailAddress: string) {
    const user = await this.userService.getUserByEmail(emailAddress);
    return this.userService.sanitizeUserInfo(user);
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
