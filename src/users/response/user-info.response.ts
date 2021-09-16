import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { AccessGroupInfo } from '../../access-group-schedule-zone/response/access-group-info.response';
import { CardResponse } from '../../card/response/card.response';
import { Company } from '../../company/company.model';
import { TypeUserRole } from '../dto/create-user.dto';
import { TypeUserStatus } from '../users.model';

export class UserInfo {
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
    type: TypeUserRole,
    enum: TypeUserRole,
    enumName: 'TypeUserRole',
  })
  readonly roles: TypeUserRole[];

  @ApiProperty({ enumName: 'TypeUserStatus', enum: TypeUserStatus })
  readonly status: TypeUserStatus;

  @ApiProperty()
  readonly phoneNumber: string;

  @ApiModelProperty()
  readonly company: Company;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly updatedBy: string;

  @ApiProperty()
  readonly department: string;

  @ApiProperty()
  readonly employeeNumber: number;

  @ApiModelProperty({ isArray: true, type: AccessGroupInfo })
  readonly accessGroups: AccessGroupInfo[];

  @ApiModelProperty({ isArray: true, type: CardResponse })
  readonly cards: CardResponse[];
}
