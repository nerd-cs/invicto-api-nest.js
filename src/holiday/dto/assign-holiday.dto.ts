import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CreateTimeslotDto } from '../../timetable/dto/create-timeslot.dto';

export class AssignHolidayDto {
  @IsBoolean()
  @ApiModelProperty()
  readonly isActive: boolean;

  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly holidayId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTimeslotDto)
  @ApiModelProperty({ isArray: true, type: CreateTimeslotDto })
  readonly timetables: CreateTimeslotDto[];
}
