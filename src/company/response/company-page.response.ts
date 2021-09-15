import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from '../../pagination/pagination.response';

export class CompanyResponse {
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
  readonly members: number;
}
export class CompanyPage extends PaginationResponse {
  @ApiProperty({ isArray: true, type: CompanyResponse })
  readonly companies: CompanyResponse[];
}
