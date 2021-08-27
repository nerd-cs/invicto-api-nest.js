import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { TypeTierAdminOption, TypeUserRole } from './create-user.dto';

export class CreateCollaboratorDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiModelProperty()
  readonly fullName: string;

  @IsNotEmpty()
  @IsEnum(TypeUserRole)
  @ApiProperty({ enumName: 'TypeUserRole', enum: TypeUserRole })
  readonly role: TypeUserRole;

  @IsOptional()
  @IsEnum(TypeTierAdminOption)
  @ApiProperty({
    enumName: 'TypeTierAdminOption',
    enum: TypeTierAdminOption,
    required: false,
  })
  readonly roleOption: TypeTierAdminOption;
}
