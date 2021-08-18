import { TypeRole } from '../../roles/roles.model';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { AssignLocationDto } from './assign-location.dto';
import { Transform, Type } from 'class-transformer';
import { CreateCardDto } from '../../card/dto/create-card.dto';

export class CreateUserDto {
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
  @Matches(/^\+1\d{10}$/, {
    message: (validationArguments) =>
      `${validationArguments.property} has invalid format`,
  })
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

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AssignLocationDto)
  @ApiModelProperty({ isArray: true, type: AssignLocationDto })
  readonly locations: AssignLocationDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  @ApiModelProperty({ isArray: true, type: CreateCardDto, required: false })
  readonly cards: CreateCardDto[];

  @IsBoolean()
  @ApiModelProperty()
  readonly instantlyInvite: boolean;
}
