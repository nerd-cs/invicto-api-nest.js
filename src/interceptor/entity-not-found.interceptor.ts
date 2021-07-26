import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';

@Injectable()
export class EntityNotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityNotFoundException) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
