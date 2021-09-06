import { ApiProperty } from '@nestjs/swagger';
import { AccessGroup } from '../access-group.model';

export class AccessGroupPerLocation {
  @ApiProperty()
  readonly locationId: number;

  @ApiProperty()
  readonly locationName: string;

  @ApiProperty({ isArray: true, type: AccessGroup })
  readonly accessGroups: AccessGroup[];
}
