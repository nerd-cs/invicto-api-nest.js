import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';
import { DoorResponse } from './door.response';

export class DoorPage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: DoorResponse })
  readonly doors: DoorResponse[];
}
