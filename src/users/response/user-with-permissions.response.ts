import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class UserWithPermissions extends UserResponse {
  @ApiProperty()
  readonly lastActivity: Date;

  @ApiProperty()
  readonly permissions: string;
}
