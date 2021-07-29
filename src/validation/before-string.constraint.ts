import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { TIME_CONSTRAINT } from '../timetable/dto/create-timeslot.dto';

@Injectable()
@ValidatorConstraint({ name: 'isBeforeString', async: false })
export class isBeforeStringConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const startTimeMatchedGroups = propertyValue.match(TIME_CONSTRAINT);
    const endTimeMatchedGroups =
      args.object[args.constraints[0]].match(TIME_CONSTRAINT);

    if (!startTimeMatchedGroups) {
      return false;
    }

    if (!endTimeMatchedGroups) {
      return true;
    }

    const startDate = new Date(
      1,
      1,
      1,
      this.prepareHours(startTimeMatchedGroups[1], startTimeMatchedGroups[3]),
      Number(startTimeMatchedGroups[2]),
    );
    const endDate = new Date(
      1,
      1,
      1,
      this.prepareHours(endTimeMatchedGroups[1], endTimeMatchedGroups[3]),
      Number(endTimeMatchedGroups[2]),
    );

    return startDate < endDate;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }

  private prepareHours(hours: string, period: string) {
    const hoursAsNumber = Number(hours);

    if (period.toLowerCase() === 'am') {
      return hoursAsNumber % 12;
    }

    return hoursAsNumber + 12;
  }
}
export function IsBeforeString(
  fieldToCompare: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsBeforeString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [fieldToCompare],
      validator: isBeforeStringConstraint,
    });
  };
}
