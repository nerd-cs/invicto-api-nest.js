import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { PASSWORD_REGEX } from '../../users/dto/complete-registration.dto';
import { PHONE_REGEX } from '../../users/dto/create-user.dto';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiModelProperty({ required: false })
  readonly fullName: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly profilePicture: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiModelProperty({ required: false })
  readonly jobTitle: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiModelProperty({ required: false })
  readonly city: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiModelProperty({ required: false })
  readonly country: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty({ required: false })
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(PHONE_REGEX, {
    message: (validationArguments) =>
      `${validationArguments.property} has invalid format`,
  })
  @ApiModelProperty({ required: false })
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ValidateIf((dto) => dto.oldPassword || dto.newPassword)
  @ApiModelProperty({ required: false })
  readonly oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Matches(PASSWORD_REGEX)
  @ValidateIf((dto) => dto.newPassword || dto.oldPassword)
  @ApiModelProperty({ required: false })
  readonly newPassword: string;
}
