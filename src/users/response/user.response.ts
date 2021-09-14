import { ApiProperty } from '@nestjs/swagger';
import { TypeUserRoleOutput } from '../dto/create-user.dto';
import { TypeUserStatus } from '../users.model';

export class UserResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly fullName: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly profilePicture: string;

  @ApiProperty({
    isArray: true,
    type: TypeUserRoleOutput,
    enum: TypeUserRoleOutput,
    enumName: 'TypeUserRoleOutput',
  })
  readonly roles: TypeUserRoleOutput[];

  @ApiProperty({ enumName: 'TypeUserStatus', enum: TypeUserStatus })
  readonly status: TypeUserStatus;

  @ApiProperty()
  readonly phoneNumber: string;

  @ApiProperty()
  readonly twoStepAuth: boolean;
}
