import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CreateCustomZoneDto } from './create-custom-zone.dto';

export class CreateZoneDto extends CreateCustomZoneDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly description: string;

  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly locationId: number;
}
