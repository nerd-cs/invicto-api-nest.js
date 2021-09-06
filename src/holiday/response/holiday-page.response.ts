import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';
import { Holiday } from '../holiday.model';

export class HolidayPage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: Holiday })
  readonly holidays: Holiday[];
}
