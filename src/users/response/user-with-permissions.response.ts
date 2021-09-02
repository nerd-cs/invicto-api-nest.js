import { ApiProperty } from '@nestjs/swagger';
import { TypeUserStatus } from '../users.model';

export class UserWithPermissions {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly fullName: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly profilePicture: string;

  @ApiProperty({ enumName: 'TypeUserStatus', enum: TypeUserStatus })
  readonly status: TypeUserStatus;

  @ApiProperty()
  readonly phoneNumber: string;

  @ApiProperty()
  readonly twoStepAuth: boolean;

  @ApiProperty()
  readonly lastActivity: Date;

  @ApiProperty()
  readonly permissions: string;
}
