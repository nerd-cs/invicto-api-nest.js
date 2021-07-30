import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNumber, IsString } from 'class-validator';

export class UpdateControllerDto {
  @IsNumber()
  @ApiModelProperty()
  readonly id: number;

  @IsString()
  @ApiModelProperty()
  readonly name: string;
}
