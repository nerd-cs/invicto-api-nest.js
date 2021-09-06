import { ApiProperty } from '@nestjs/swagger';
import { TimeslotResponse } from '../../timetable/response/timeslot.response';

export class HolidayDescription {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty({ isArray: true, type: TimeslotResponse })
  readonly timetables: TimeslotResponse[];
}
