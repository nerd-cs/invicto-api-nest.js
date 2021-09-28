import { ApiProperty } from '@nestjs/swagger';

export class DepartmentResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;
}
