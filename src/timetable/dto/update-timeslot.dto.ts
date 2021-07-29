import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNumber, IsString, Matches, ValidateIf } from 'class-validator';
import { IsBeforeString } from '../../validation/before-string.constraint';
import { TIME_CONSTRAINT } from './create-timeslot.dto';

export class UpdateTimeslotDto {
  @IsNumber()
  @ValidateIf(
    (dto) =>
      dto.id ||
      (dto.startTime && !dto.endTime) ||
      (!dto.startTime && dto.endTime),
  )
  @ApiModelProperty({ required: false })
  readonly id: number;

  @IsString()
  @Matches(TIME_CONSTRAINT)
  @IsBeforeString('endTime')
  @ApiModelProperty({ example: '10:10 AM', required: false })
  @ValidateIf((dto) => dto.startTime || (!dto.id && dto.endTime))
  readonly startTime: string;

  @IsString()
  @Matches(TIME_CONSTRAINT)
  @ValidateIf((dto) => dto.endTime || (!dto.id && dto.startTime))
  @ApiModelProperty({ example: '10:10 AM', required: false })
  readonly endTime: string;
}
