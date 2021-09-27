import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TypeUserStatus } from '../users.model';

export enum PartialUserStatus {
  INACTIVE = TypeUserStatus.INACTIVE,
  ARCHIVED = TypeUserStatus.ARCHIVED,
  ACTIVE = TypeUserStatus.ACTIVE,
}
export class ChangeUserStatusDto {
  @IsNotEmpty()
  @IsEnum(PartialUserStatus)
  @ApiProperty({ enumName: 'PartialUserStatus', enum: PartialUserStatus })
  readonly status: PartialUserStatus;
}
