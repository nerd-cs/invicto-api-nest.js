import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Token } from '../token/token.model';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailConfirmation(token: Token, origin: string) {
    const serverAddress = origin
      ? origin
      : `http://${process.env.SERVER_HOST}:${process.env.PORT}`;
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
}
