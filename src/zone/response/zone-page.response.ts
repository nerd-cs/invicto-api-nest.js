import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';
import { ZoneInfo } from './zone-info.response';

export class ZonePage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: ZoneInfo })
  readonly zones: ZoneInfo[];
}
