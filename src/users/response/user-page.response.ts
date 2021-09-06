import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';
import { UserWithAccessGroups } from './user-with-access-groups.response';
import { UserWithPermissions } from './user-with-permissions.response';

@ApiExtraModels(UserWithAccessGroups, UserWithPermissions)
export class UserPage extends PaginationResponse {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        {
          $ref: '#/components/schemas/UserWithAccessGroups',
        },
        {
          $ref: '#/components/schemas/UserWithPermissions',
        },
      ],
    },
  })
  readonly users: UserWithAccessGroups[] | UserWithPermissions[];
}
