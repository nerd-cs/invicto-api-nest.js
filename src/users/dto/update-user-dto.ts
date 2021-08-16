import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { TypeUserStatus } from '../users.model';
import {
  PHONE_REGEX,
  TypeTierAdminOption,
  TypeUserRole,
} from './create-user.dto';

export enum UserStatusForUpdate {
  ARCHIVED = TypeUserStatus.ARCHIVED,
  INACTIVE = TypeUserStatus.INACTIVE,
  ACTIVE = TypeUserStatus.ACTIVE,
}
export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @ApiModelProperty()
  readonly id: number;

  @ValidateIf(
    (dto) =>
      dto.profilePicture ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.department &&
        !dto.roleOption &&
        !dto.email),
  )
  @ApiModelProperty({ required: false })
  readonly profilePicture: string | null;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @ValidateIf(
    (dto) =>
      dto.fullName ||
      (!dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.department &&
        !dto.roleOption &&
        !dto.email),
  )
  @ApiModelProperty({ required: false })
  readonly fullName: string;

  @IsEmail()
  @ValidateIf(
    (dto) =>
      dto.email ||
      (!dto.fullName &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.roleOption &&
        !dto.department),
  )
  @ApiModelProperty({ required: false })
  readonly email: string;

  @IsEnum(UserStatusForUpdate)
  @ValidateIf(
    (dto) =>
      dto.status ||
      (!dto.fullName &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.department &&
        !dto.roleOption &&
        !dto.email),
  )
  @ApiProperty({
    enum: UserStatusForUpdate,
    enumName: 'UserStatusForUpdate',
    required: false,
  })
  readonly status: UserStatusForUpdate;

  @IsEnum(TypeUserRole)
  @ValidateIf(
    (dto) =>
      dto.role ||
      (!dto.fullName &&
        !dto.status &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.department &&
        !dto.roleOption &&
        !dto.email),
  )
  @ApiProperty({
    enum: TypeUserRole,
    enumName: 'TypeUserRole',
    required: false,
  })
  readonly role: TypeUserRole;

  @IsEnum(TypeTierAdminOption)
  @ValidateIf(
    (dto) =>
      dto.roleOption ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.department &&
        !dto.email),
  )
  @ApiProperty({
    enum: TypeTierAdminOption,
    enumName: 'TypeTierAdminOption',
    required: false,
  })
  readonly roleOption: TypeTierAdminOption;

  @IsString()
  @Matches(PHONE_REGEX, {
    message: (validationArguments) =>
      `${validationArguments.property} has invalid format`,
  })
  @ValidateIf(
    (dto) =>
      dto.phoneNumber ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.employeeNumber &&
        !dto.department &&
        !dto.roleOption &&
        !dto.email),
  )
  @ApiModelProperty({ required: false })
  readonly phoneNumber: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @ValidateIf(
    (dto) =>
      dto.employeeNumber ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.department &&
        !dto.roleOption &&
        !dto.email),
  )
  @ApiModelProperty({ required: false })
  readonly employeeNumber: number;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @ValidateIf(
    (dto) =>
      dto.department ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.roleOption &&
        !dto.email),
  )
  @ApiModelProperty({ required: false })
  readonly department: string;
}
