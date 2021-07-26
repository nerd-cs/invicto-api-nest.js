import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly description: string;

  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly locationId: number;

  @ValidateIf((dto) => !dto.zoneIds || dto.doors)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ApiModelProperty({ isArray: true, type: 'integer', required: false })
  readonly doorIds: number[];

  @ValidateIf((dto) => !dto.doorIds || dto.zoneIds)
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ApiModelProperty({ isArray: true, type: 'integer', required: false })
  readonly zoneIds: number[];
}
