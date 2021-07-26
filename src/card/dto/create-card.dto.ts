import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { TypeCardType } from '../card.model';

export class CreateCardDto {
  @ApiProperty({ enum: TypeCardType, enumName: 'TypeCardType', required: true })
  @IsNotEmpty()
  @IsEnum(TypeCardType)
  readonly type: TypeCardType;

  @ApiModelProperty({ required: true })
  @IsNotEmpty()
  @IsDateString()
  readonly activationDate: Date;

  @ApiModelProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  readonly expirationDate: Date;

  @ApiModelProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly number: number;
}
