import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { TypeDayOfWeek } from '../timetable.model';
import { UpdateTimeslotDto } from './update-timeslot.dto';

export class UpdateTimetableDto {
  @IsEnum(TypeDayOfWeek)
  @ApiProperty({
    enum: TypeDayOfWeek,
    enumName: 'TypeDayOfWeek',
    required: false,
  })
  readonly day: TypeDayOfWeek;

  @IsBoolean()
  @ApiModelProperty({ required: false })
  readonly isActive: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTimeslotDto)
  @ApiModelProperty({ isArray: true, type: UpdateTimeslotDto, required: false })
  readonly timeslots: UpdateTimeslotDto[];
}
