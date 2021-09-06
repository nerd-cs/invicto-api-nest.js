import { ApiProperty } from '@nestjs/swagger';
import { TypeDoorStatus } from '../door.model';

export class DoorResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ enum: TypeDoorStatus, enumName: 'TypeDoorStatus' })
  readonly status: TypeDoorStatus;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly location: string;

  @ApiProperty()
  readonly zones: number;
}
