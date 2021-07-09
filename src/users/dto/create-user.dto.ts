import { TypeRole } from '../../roles/roles.model';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^([A-z]+ ?[A-z])+$')
  @ApiModelProperty()
  readonly fullName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(TypeRole)
  @ApiProperty({ enumName: 'TypeRole', enum: TypeRole })
  readonly role: TypeRole;

  @IsBoolean()
  @IsOptional()
  @ApiModelProperty({ required: false })
  readonly allowSso: boolean;
}
