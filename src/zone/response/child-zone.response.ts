import { ApiProperty } from '@nestjs/swagger';

export class ChildZoneResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ required: false })
  readonly description: string;

  @ApiProperty()
  readonly updatedAt: Date;
}
