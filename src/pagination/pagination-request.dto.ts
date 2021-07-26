import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class PaginationRequestDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiModelProperty()
  readonly page: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiModelProperty()
  readonly limit: number;
}
