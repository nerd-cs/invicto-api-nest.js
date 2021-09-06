import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';
import { ControllerResponse } from './controller.response';

export class ControllerPage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: ControllerResponse })
  readonly controllers: ControllerResponse[];
}
