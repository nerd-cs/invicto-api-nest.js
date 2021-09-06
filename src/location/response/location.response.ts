import { ApiProperty } from '@nestjs/swagger';

export class LocationResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;
}
