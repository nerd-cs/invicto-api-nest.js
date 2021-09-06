import { ApiProperty } from '@nestjs/swagger';
import { LocationResponse } from '../../location/response/location.response';

export class AccessGroupInfo {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ isArray: true, type: LocationResponse })
  readonly locations: LocationResponse[];

  @ApiProperty()
  readonly lastActivity: Date;

  @ApiProperty()
  readonly zones: string[];
}
