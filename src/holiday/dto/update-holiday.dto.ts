import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { TypeHolidayRecurrence } from '../holiday.model';

export class UpdateHolidayDto {
  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    (dto) => (!dto.recurrence && !dto.startDate && !dto.endDate) || dto.name,
  )
  @ApiModelProperty({ required: false })
  name: string;

  @IsEnum(TypeHolidayRecurrence)
  @ValidateIf(
    (dto) => (!dto.name && !dto.startDate && !dto.endDate) || dto.recurrence,
  )
  @ApiProperty({
    enum: TypeHolidayRecurrence,
    enumName: 'TypeHolidayRecurrence',
    required: false,
  })
  recurrence: TypeHolidayRecurrence;

  @IsDateString()
  @ValidateIf(
    (dto) => (!dto.name && !dto.recurrence && !dto.endDate) || dto.startDate,
  )
  @ApiModelProperty({ required: false })
  startDate: Date;

  @IsDateString()
  @ValidateIf(
    (dto) => (!dto.name && !dto.recurrence && !dto.startDate) || dto.endDate,
  )
  @ApiModelProperty({ required: false })
  endDate: Date;
}
