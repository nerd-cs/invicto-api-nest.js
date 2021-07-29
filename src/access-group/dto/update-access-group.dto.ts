import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { LinkScheduleZoneDto } from '../../access-group-schedule-zone/dto/link-schedule-zone.dto';

export class UpdateAccessGroupDto {
  @IsNumber()
  @ApiModelProperty()
  readonly id: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false })
  readonly description: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiModelProperty({ required: false })
  readonly locationId: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => LinkScheduleZoneDto)
  @ApiModelProperty({
    isArray: true,
    type: LinkScheduleZoneDto,
    required: false,
  })
  readonly zoneSchedules: LinkScheduleZoneDto[];
}
