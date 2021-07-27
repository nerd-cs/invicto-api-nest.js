import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'isBeforeOrEqual', async: false })
export class IsBeforeOrEqualConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: Date, args: ValidationArguments) {
    return propertyValue <= args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before or equal "${args.constraints[0]}"`;
  }
}
export function IsBeforeOrEqual(
  fieldToCompare: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBeforeOrEqual',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [fieldToCompare],
      validator: IsBeforeOrEqualConstraint,
    });
  };
}
