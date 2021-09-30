import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiModelProperty({ required: false })
  readonly id: number;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;
}
