import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class UserWithAccessGroups extends UserResponse {
  @ApiProperty({ isArray: true, type: 'string' })
  readonly accessGroups: string[];

  @ApiProperty()
  readonly lastActivity: Date;
}
