import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';
import { ScheduleResponse } from './schedule.response';

export class SchedulePage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: ScheduleResponse })
  readonly schedules: ScheduleResponse[];
}
