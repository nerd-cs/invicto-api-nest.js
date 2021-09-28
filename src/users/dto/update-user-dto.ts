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
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
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
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
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
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.roleOption &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.costCenterId &&
        dto.costCenter !== null),
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
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
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
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
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
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
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
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
  )
  @ApiModelProperty({ required: false })
  readonly phoneNumber: string;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @ValidateIf(
    (dto) =>
      dto.companyId ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.employeeNumber &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
  )
  @ApiModelProperty({ required: false })
  readonly companyId: number;

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
        !dto.companyId &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.departmentId &&
        dto.departmentId !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
  )
  @ApiModelProperty({ required: false })
  readonly employeeNumber: number;

  @ValidateIf(
    (dto) =>
      dto.departmentId ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.costCenterId &&
        dto.costCenter !== null),
  )
  @ApiModelProperty({ required: false })
  readonly departmentId: number | null;

  @ValidateIf(
    (dto) =>
      dto.costCenterId ||
      (!dto.fullName &&
        !dto.status &&
        !dto.role &&
        !dto.phoneNumber &&
        !dto.companyId &&
        !dto.employeeNumber &&
        !dto.profilePicture &&
        dto.profilePicture !== null &&
        !dto.roleOption &&
        !dto.email &&
        !dto.departmentId &&
        dto.departmentId !== null),
  )
  @ApiModelProperty({ required: false })
  readonly costCenterId: number | null;
}
