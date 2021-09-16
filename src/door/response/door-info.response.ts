import { ApiProperty } from '@nestjs/swagger';
import { HolidayDescription } from '../../holiday/response/holiday-description.response';
import { TimetableResponse } from '../../timetable/response/timetable.response';

export class DoorInfo {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ isArray: true, type: TimetableResponse })
  readonly timetables: TimetableResponse[];

  @ApiProperty({ isArray: true, type: HolidayDescription })
  readonly holidays: HolidayDescription[];
}
