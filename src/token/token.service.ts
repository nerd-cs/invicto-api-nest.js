import { Injectable } from '@nestjs/common';
import { User } from '../users/users.model';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.model';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async createToken(user: User) {
    const token = new Token();

    token.value = crypto
      .createHash('sha256')
      .update(user.email)
      .update(crypto.randomBytes(256).toString('hex'))
      .digest('hex');

    token.user = user;

    token.validThrough = new Date(
      Date.now() + Number(process.env.TOKEN_VALIDITY_MS),
    );

    return await this.tokenRepository.save(token);
  }

  async removeByValue(value: string) {
    const token = await this.tokenRepository.findOne({
      where: { value: value },
    });

    await this.tokenRepository.remove(token);
  }
}
