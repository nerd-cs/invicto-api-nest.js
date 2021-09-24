import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { CreateCardDto } from '../../card/dto/create-card.dto';

export class CreateUserCardsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  @ApiModelProperty({ isArray: true, type: CreateCardDto })
  readonly cards: CreateCardDto[];

  @IsOptional()
  @IsBoolean()
  @ApiModelProperty({ required: false })
  readonly instantlyInvite: boolean;
}
