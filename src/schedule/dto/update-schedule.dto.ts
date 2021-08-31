import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UpdateScheduleHolidayDto } from '../../schedule-holiday/dto/update-schedule-holiday.dto';
import { UpdateTimetableDto } from '../../timetable/dto/update-timetable.dto';

export class UpdateScheduleDto {
  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly id: number;

  @IsString()
  @ValidateIf(
    (dto) => (!dto.description && !dto.timetables && !dto.holidays) || dto.name,
  )
  @ApiModelProperty({ required: false })
  readonly name: string;

  @IsString()
  @ValidateIf(
    (dto) => (!dto.name && !dto.timetables && !dto.holidays) || dto.description,
  )
  @ApiModelProperty({ required: false })
  readonly description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateTimetableDto)
  @ValidateIf(
    (dto) => (!dto.name && !dto.description && !dto.holidays) || dto.timetables,
  )
  @ApiModelProperty({
    isArray: true,
    type: UpdateTimetableDto,
    required: false,
  })
  readonly timetables: UpdateTimetableDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScheduleHolidayDto)
  @ValidateIf(
    (dto) => (!dto.name && !dto.description && !dto.timetables) || dto.holidays,
  )
  @ApiModelProperty({
    isArray: true,
    type: UpdateScheduleHolidayDto,
    required: false,
  })
  readonly holidays: UpdateScheduleHolidayDto[];
}
