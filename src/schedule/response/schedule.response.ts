import { ApiProperty } from '@nestjs/swagger';

export class ScheduleResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ isArray: true, type: 'string' })
  readonly holidays: string[];
}
