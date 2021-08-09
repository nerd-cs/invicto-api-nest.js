import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  @ApiModelProperty()
  readonly email: string;
}
