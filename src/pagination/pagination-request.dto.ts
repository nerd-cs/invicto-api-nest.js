import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive, ValidateIf } from 'class-validator';

export class PaginationRequestDto {
  @ValidateIf((dto) => dto.page || dto.limit)
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiModelProperty({ required: false })
  readonly page: number;

  @ValidateIf((dto) => dto.limit || dto.page)
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  @ApiModelProperty({ required: false })
  readonly limit: number;
}
