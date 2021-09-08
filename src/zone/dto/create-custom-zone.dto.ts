import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsString,
  IsNotEmpty,
  ValidateIf,
  IsArray,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateCustomZoneDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;

  @ValidateIf((dto) => !dto.zoneIds || dto.doors)
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ApiModelProperty({ isArray: true, type: 'integer', required: false })
  readonly doorIds: number[];

  @ValidateIf((dto) => !dto.doorIds || dto.zoneIds)
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ApiModelProperty({ isArray: true, type: 'integer', required: false })
  readonly zoneIds: number[];
}
