import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { TypeDayOfWeek } from '../timetable.model';
import { CreateTimeslotDto } from './create-timeslot.dto';

export class CreateTimetableDto {
  @IsEnum(TypeDayOfWeek)
  @ApiProperty({ enum: TypeDayOfWeek, enumName: 'TypeDayOfWeek' })
  readonly day: TypeDayOfWeek;

  @IsBoolean()
  @ApiModelProperty()
  readonly isActive: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTimeslotDto)
  @ApiModelProperty({ isArray: true, type: CreateTimeslotDto })
  readonly timeslots: CreateTimeslotDto[];
}
