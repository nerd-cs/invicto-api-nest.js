import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AssignHolidayDto } from '../../holiday/dto/assign-holiday.dto';
import { CreateTimetableDto } from '../../timetable/dto/create-timetable.dto';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false })
  readonly description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTimetableDto)
  @ApiModelProperty({ isArray: true, type: CreateTimetableDto })
  readonly timetables: CreateTimetableDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignHolidayDto)
  @ApiModelProperty({ isArray: true, type: AssignHolidayDto, required: false })
  readonly holidays: AssignHolidayDto[];
}
