import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Token } from '../token/token.model';
import { User } from '../users/users.model';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendInvitation(user: User, accessGroups: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Invicto!',
      template: './invitation',
      context: {
        name: user.fullName,
        accessGroups,
      },
    });
  }

  async sendEmailConfirmation(token: Token, origin: string) {
    const serverAddress = this.constructServerAddress(origin);
    const url = `${serverAddress}/signup?token=${token.value}`;

    await this.mailerService.sendMail({
      to: token.user.email,
      subject: 'Welcome to Invicto! Please confirm your email',
      template: './confirmation',
      context: {
        name: token.user.fullName,
        url,
      },
    });
  }

  async sendPasswordReset(token: Token, origin: string) {
    const serverAddress = this.constructServerAddress(origin);
    const url = `${serverAddress}/login/password-reset?token=${token.value}`;

    await this.mailerService.sendMail({
      to: token.user.email,
      subject: 'Password reset request for your Invicto account',
      template: './password-reset',
      context: {
        name: token.user.fullName,
        url,
      },
    });
  }

  private constructServerAddress(origin: string) {
    return origin
      ? origin
      : `http://${process.env.SERVER_HOST}:${process.env.PORT}`;
  }
}
