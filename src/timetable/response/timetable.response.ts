import { ApiProperty } from '@nestjs/swagger';
import { TypeDayOfWeek } from '../timetable.model';
import { TimeslotResponse } from './timeslot.response';

export class TimetableResponse {
  @ApiProperty({ enumName: 'TypeDayOfWeek', enum: TypeDayOfWeek })
  readonly day: TypeDayOfWeek;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty({ isArray: true, type: TimeslotResponse })
  readonly timeslots: TimeslotResponse[];
}
