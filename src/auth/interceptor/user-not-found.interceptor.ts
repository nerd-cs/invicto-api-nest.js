import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { EntityNotFoundException } from '../../exception/entity-not-found.exception';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UserNotFoundInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof EntityNotFoundException) {
          return throwError(
            new UnauthorizedException('Associated account does not exist'),
          );
        }

        return throwError(err);
      }),
    );
  }
}
