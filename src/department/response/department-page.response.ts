import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';

export class DepartmentItem {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly members: number;
}
export class DepartmentPage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: DepartmentItem })
  readonly departments: DepartmentItem[];
}
