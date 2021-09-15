import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';

export class UpdateCompanyDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiModelProperty()
  readonly id: number;

  @ValidateIf(
    (dto) =>
      dto.name ||
      (!dto.address && !dto.city && !dto.postalCode && !dto.country),
  )
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly name: string;

  @ValidateIf(
    (dto) =>
      dto.address ||
      (!dto.name && !dto.city && !dto.postalCode && !dto.country),
  )
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly address: string;

  @ValidateIf(
    (dto) =>
      dto.city ||
      (!dto.name && !dto.address && !dto.postalCode && !dto.country),
  )
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly city: string;

  @ValidateIf(
    (dto) =>
      dto.postalCode ||
      (!dto.name && !dto.address && !dto.city && !dto.country),
  )
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly postalCode: string;

  @ValidateIf(
    (dto) =>
      dto.country ||
      (!dto.name && !dto.address && !dto.city && !dto.postalCode),
  )
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly country: string;
}
