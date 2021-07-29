import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsString, Matches } from 'class-validator';
import { IsBeforeString } from '../../validation/before-string.constraint';

export const TIME_CONSTRAINT = /(1[012]|[1-9]):([0-5][0-9])\s?(am|pm)/i;
export class CreateTimeslotDto {
  @IsString()
  @Matches(TIME_CONSTRAINT)
  @IsBeforeString('endTime')
  @ApiModelProperty({ example: '10:10 AM' })
  readonly startTime: string;

  @IsString()
  @Matches(TIME_CONSTRAINT)
  @ApiModelProperty({ example: '10:10 AM' })
  readonly endTime: string;
}
