import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive } from 'class-validator';

export class AssignLocationDto {
  @IsNumber()
  @IsPositive()
  @ApiModelProperty({ required: true })
  readonly locationId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ApiModelProperty({ isArray: true, required: true })
  readonly accessGroupIds: number[];
}
