import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LinkScheduleZoneDto } from '../../access-group-schedule-zone/dto/link-schedule-zone.dto';

export class CreateAccessGroupDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false })
  readonly description: string;

  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly locationId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LinkScheduleZoneDto)
  @ApiModelProperty({ isArray: true, type: LinkScheduleZoneDto })
  readonly zoneSchedules: LinkScheduleZoneDto[];
}
