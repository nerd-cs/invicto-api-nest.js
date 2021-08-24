import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsDateString,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

export class UpdateUserCardDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @ApiModelProperty()
  readonly id: number;

  @ApiModelProperty({ required: false })
  @IsNotEmpty()
  @IsDateString()
  @ValidateIf(
    (dto) =>
      dto.activationDate ||
      (!dto.expirationDate &&
        dto.expirationDate !== null &&
        !dto.number &&
        !dto.isActive &&
        dto.isActive !== false),
  )
  readonly activationDate: Date;

  @ApiModelProperty({ required: false })
  @ValidateIf(
    (dto) =>
      dto.expirationDate ||
      (!dto.activationDate &&
        !dto.number &&
        !dto.isActive &&
        dto.isActive !== false),
  )
  readonly expirationDate: Date;

  @ApiModelProperty({ required: false })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ValidateIf(
    (dto) =>
      dto.number ||
      (!dto.activationDate &&
        !dto.expirationDate &&
        dto.expirationDate !== null &&
        !dto.isActive &&
        dto.isActive !== false),
  )
  readonly number: number;

  @IsNotEmpty()
  @IsBoolean()
  @ValidateIf(
    (dto) =>
      dto.isActive ||
      (!dto.activationDate &&
        !dto.expirationDate &&
        dto.expirationDate !== null &&
        !dto.number),
  )
  @ApiModelProperty({ required: false })
  readonly isActive: boolean;
}
