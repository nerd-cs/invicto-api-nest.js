import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { TypeCardType } from '../card.model';

export class CardResponse {
  @ApiProperty()
  readonly id: number;

  @ApiProperty({ enum: TypeCardType, enumName: 'TypeCardType' })
  readonly type: TypeCardType;

  @ApiProperty()
  readonly cardNumber: number;

  @ApiProperty()
  readonly activationDate: Date;

  @ApiProperty()
  readonly expirationDate: Date;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiModelProperty()
  readonly createdAt: Date;

  @ApiModelProperty()
  readonly lastActivity: Date;
}
