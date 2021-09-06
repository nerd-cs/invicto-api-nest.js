import { ApiProperty } from '@nestjs/swagger';

export class TimeslotResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty({ example: '10:10 AM' })
  readonly startTime: string;

  @ApiProperty({ example: '10:10 PM' })
  readonly endTime: string;
}
