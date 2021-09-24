import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/company.model';
import { TypeUserRoleOutput } from '../dto/create-user.dto';
import { TypeUserStatus } from '../users.model';

export class UserWithAccessGroups {
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

  @ApiProperty({ isArray: true, type: 'string' })
  readonly accessGroups: string[];

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly company: Company;
}
