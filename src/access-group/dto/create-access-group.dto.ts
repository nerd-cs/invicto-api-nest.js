import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { LinkScheduleZoneDto } from '../../access-group-schedule-zone/dto/link-schedule-zone.dto';
import { CreateCustomAccessDto } from './create-custom-access.dto';

export class CreateAccessGroupDto {
  @IsString()
  @ApiModelProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false })
  readonly description: string;

  @ValidateIf((dto) => dto.zoneSchedules || !dto.custom)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkScheduleZoneDto)
  @ApiModelProperty({
    isArray: true,
    type: LinkScheduleZoneDto,
    required: false,
  })
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
