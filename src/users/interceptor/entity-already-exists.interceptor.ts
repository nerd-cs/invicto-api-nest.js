import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { EntityAlreadyExistsException } from '../../exception/entity-already-exists.exception';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EntityAlreadyExistsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof EntityAlreadyExistsException) {
          throw new BadRequestException('Email is already taken');
        } else {
          throw error;
        }
      }),
    );
  }
}
