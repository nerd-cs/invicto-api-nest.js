import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../../company/company.model';

export class AccountResponse {
  @ApiProperty()
  readonly fullName: string;

  @ApiProperty()
  readonly profilePicture: string;

  @ApiProperty()
  readonly jobTitle: string;

  @ApiProperty({ type: Company })
  readonly company: Company;

  @ApiProperty()
  readonly city: string;

  @ApiProperty()
  readonly country: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phoneNumber: string;

  @ApiProperty()
  readonly twoStepAuth: boolean;
}
