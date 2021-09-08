import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
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
  @ValidateNested({ each: true })
  @Type(() => LinkScheduleZoneDto)
  @ApiModelProperty({ isArray: true, type: LinkScheduleZoneDto })
  readonly zoneSchedules: LinkScheduleZoneDto[];

  @ValidateIf((dto) => dto.custom || !dto.zoneSchedules)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomAccessDto)
  @ApiModelProperty({
    isArray: true,
    type: CreateCustomAccessDto,
    required: false,
  })
  readonly custom: CreateCustomAccessDto[];
}
