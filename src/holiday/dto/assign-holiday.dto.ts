import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsBoolean, IsNumber, IsPositive } from 'class-validator';

export class AssignHolidayDto {
  @IsBoolean()
  @ApiModelProperty()
  readonly isActive: boolean;

  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly holidayId: number;
}
