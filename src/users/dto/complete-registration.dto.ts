import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsString, Matches } from 'class-validator';

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
export class CompleteRegistrationDto {
  @IsString()
  @ApiModelProperty()
  readonly token: string;

  @IsString()
  @Matches(PASSWORD_REGEX)
  @ApiModelProperty()
  readonly password: string;
}
