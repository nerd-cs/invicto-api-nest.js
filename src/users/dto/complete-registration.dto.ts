import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsString, Matches } from 'class-validator';

export class CompleteRegistrationDto {
  @IsString()
  @ApiModelProperty()
  readonly token: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/)
  @ApiModelProperty()
  readonly password: string;
}
