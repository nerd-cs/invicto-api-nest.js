import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateZoneDto {
  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    (dto) => (!dto.description && !dto.doorIds && !dto.zoneIds) || dto.name,
  )
  @ApiModelProperty({ required: false })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf(
    (dto) => (!dto.name && !dto.doorIds && !dto.zoneIds) || dto.description,
  )
  @ApiModelProperty({ required: false })
  readonly description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ValidateIf(
    (dto) => (!dto.description && !dto.name && !dto.zoneIds) || dto.doorIds,
  )
  @ApiModelProperty({ isArray: true, required: false })
  readonly doorIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ValidateIf(
    (dto) => (!dto.description && !dto.name && !dto.doorIds) || dto.zoneIds,
  )
  @ApiModelProperty({ isArray: true, required: false })
  readonly zoneIds: number[];
}
