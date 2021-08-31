import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTimeslotDto)
  @ApiModelProperty({ isArray: true, type: CreateTimeslotDto })
  readonly timeslots: CreateTimeslotDto[];
}
