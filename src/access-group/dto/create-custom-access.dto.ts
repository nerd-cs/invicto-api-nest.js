import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { CreateScheduleDto } from '../../schedule/dto/create-schedule.dto';
import { CreateZoneDto } from '../../zone/dto/create-zone.dto';

export class CreateCustomAccessDto {
  @ApiModelProperty()
  readonly zone: CreateZoneDto;

  @ApiModelProperty()
  readonly schedule: CreateScheduleDto;
}
