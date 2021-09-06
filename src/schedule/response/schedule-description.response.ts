import { ApiProperty } from '@nestjs/swagger';
import { HolidayDescription } from '../../holiday/response/holiday-description.response';
import { TimetableResponse } from '../../timetable/response/timetable.response';

export class ScheduleDescription {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ isArray: true, type: HolidayDescription })
  readonly holidays: HolidayDescription[];

  @ApiProperty({ isArray: true, type: TimetableResponse })
  readonly timetables: TimetableResponse[];
}
