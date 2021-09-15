import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly postalCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly country: string;
}
