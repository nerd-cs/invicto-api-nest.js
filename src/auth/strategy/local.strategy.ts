import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  authenticate(req: any, options?: any) {
    const errorMessage = this.validateInput(req.body.email, req.body.password);
    if (errorMessage) {
      throw new BadRequestException(errorMessage);
    }
    super.authenticate(req, options);
  }

  async validate(username: string, password: string): Promise<any> {
    return await this.authService.validateUser(username, password);
  }

  private validateInput(email: any, password: any): string {
    if (!email) {
      return 'Email is required';
    }
    if (!isEmail(email)) {
      return 'Email has incorrect format';
    }
    if (!password) {
      return 'Password is required';
    }
  }
}
