import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UpdateScheduleHolidayDto } from '../../schedule-holiday/dto/update-schedule-holiday.dto';
import { UpdateTimetableDto } from '../../timetable/dto/update-timetable.dto';

export class UpdateDoorDto {
  @IsNumber()
  @ApiModelProperty()
  readonly id: number;

  @ValidateIf((dto) => dto.name || (!dto.timetables && !dto.holidays))
  @IsString()
  @ApiModelProperty({ required: false })
  readonly name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTimetableDto)
  @ValidateIf((dto) => (!dto.name && !dto.holidays) || dto.timetables)
  @ApiModelProperty({
    isArray: true,
    type: UpdateTimetableDto,
    required: false,
  })
  readonly timetables: UpdateTimetableDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateScheduleHolidayDto)
  @ValidateIf((dto) => (!dto.name && !dto.timetables) || dto.holidays)
  @ApiModelProperty({
    isArray: true,
    type: UpdateScheduleHolidayDto,
    required: false,
  })
  readonly holidays: UpdateScheduleHolidayDto[];
}
