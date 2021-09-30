import { ApiProperty } from '@nestjs/swagger';

export class CompanyInfo {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly postalCode: string;

  @ApiProperty()
  readonly country: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly updatedBy: string;
}
