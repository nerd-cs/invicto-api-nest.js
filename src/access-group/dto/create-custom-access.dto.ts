import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { CreateScheduleDto } from '../../schedule/dto/create-schedule.dto';
import { CreateCustomZoneDto } from '../../zone/dto/create-custom-zone.dto';

export class CreateCustomAccessDto {
  @ApiModelProperty()
  readonly zone: CreateCustomZoneDto;

  @ApiModelProperty()
  readonly schedule: CreateScheduleDto;
}
