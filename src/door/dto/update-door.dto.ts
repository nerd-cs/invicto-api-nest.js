import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNumber, IsString } from 'class-validator';

export class UpdateDoorDto {
  @IsNumber()
  @ApiModelProperty()
  readonly id: number;

  @IsString()
  @ApiModelProperty()
  readonly name: string;
}
