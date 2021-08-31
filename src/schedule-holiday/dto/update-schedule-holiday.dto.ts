import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { UpdateTimeslotDto } from '../../timetable/dto/update-timeslot.dto';

export class UpdateScheduleHolidayDto {
  @IsBoolean()
  @ValidateIf((dto) => dto.isActive || dto.isActive === false || !dto.timeslots)
  @ApiModelProperty({ required: false })
  readonly isActive: boolean;

  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly holidayId: number;

  @IsArray()
  @ValidateIf(
    (dto) => dto.timeslots || (!dto.isActive && dto.isActive !== false),
  )
  @ValidateNested({ each: true })
  @Type(() => UpdateTimeslotDto)
  @ApiModelProperty({ isArray: true, type: UpdateTimeslotDto, required: false })
  readonly timetables: UpdateTimeslotDto[];
}
