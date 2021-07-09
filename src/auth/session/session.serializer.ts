import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  deserializeUser(user: any, done: (err: any, user: any) => void): any {
    done(null, user);
  }

  serializeUser(payload: any, done: (err: any, payload: string) => void): any {
    done(null, payload);
  }
}
