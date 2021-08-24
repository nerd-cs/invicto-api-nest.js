import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ChangeActivenessDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiModelProperty()
  readonly isActive: boolean;
}
