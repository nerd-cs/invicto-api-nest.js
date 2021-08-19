import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TypeRole } from '../../roles/roles.model';

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
  @IsEnum(TypeRole)
  @ApiProperty({ enumName: 'TypeRole', enum: TypeRole })
  readonly role: TypeRole;
}
