import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsBeforeOrEqual } from '../../validation/before-or-equal.constraint';
import { TypeHolidayRecurrence } from '../holiday.model';

export class CreateHolidayDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;

  @IsEnum(TypeHolidayRecurrence)
  @ApiProperty({
    enum: TypeHolidayRecurrence,
    enumName: 'TypeHolidayRecurrence',
  })
  readonly recurrence: TypeHolidayRecurrence;

  @IsDateString()
  @IsBeforeOrEqual('endDate')
  @ApiModelProperty()
  readonly startDate: Date;

  @IsDateString()
  @ApiModelProperty()
  readonly endDate: Date;
}
