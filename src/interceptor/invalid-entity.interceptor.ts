import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { ConstraintViolationException } from '../exception/constraint-violation.exception';
import { EntityAlreadyExistsException } from '../exception/entity-already-exists.exception';
import { EntityNotFoundException } from '../exception/entity-not-found.exception';
import { InvalidInvitationException } from '../exception/invalid-invitation.exception';
import { InvalidTokenException } from '../exception/invalid-token.exception';

@Injectable()
export class InvalidEntityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        if (
          error instanceof EntityNotFoundException ||
          error instanceof EntityAlreadyExistsException ||
          error instanceof ConstraintViolationException ||
          error instanceof InvalidTokenException ||
          error instanceof InvalidInvitationException
        ) {
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
