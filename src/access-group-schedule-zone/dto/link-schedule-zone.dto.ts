import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNumber } from 'class-validator';

export class LinkScheduleZoneDto {
  @IsNumber()
  @ApiModelProperty()
  zoneId: number;

  @IsNumber()
  @ApiModelProperty()
  scheduleId: number;
}
