import { ApiResponseProperty } from '@nestjs/swagger';

export class PaginationResponse {
  @ApiResponseProperty()
  readonly total: number;
}
