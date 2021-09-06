import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { AccessGroupScheduleZone } from '../../access-group-schedule-zone/access-group-schedule-zone.model';
import { PaginationResponse } from '../../pagination/pagination.response';

export class AccessGroupResponse {
  @ApiResponseProperty()
  readonly id: number;

  @ApiResponseProperty()
  readonly name: string;

  @ApiResponseProperty()
  readonly description: string;

  @ApiResponseProperty()
  readonly updatedAt: Date;

  @ApiResponseProperty()
  readonly users: number;

  @ApiProperty({ isArray: true, type: AccessGroupScheduleZone })
  readonly zoneSchedules: AccessGroupScheduleZone[];
}
export class AccessGroupPage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: AccessGroupResponse })
  readonly accessGroups: AccessGroupResponse[];
}
