import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';
import { UserWithAccessGroups } from './user-with-access-groups.response';

export class UserPage extends PaginationResponse {
  @ApiProperty({
    isArray: true,
    type: UserWithAccessGroups,
  })
  readonly users: UserWithAccessGroups[];
}
