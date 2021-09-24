import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequestDto } from './pagination-request.dto';

export enum TypeFilterRole {
  ADMIN = 'ADMIN',
  TIER_ADMIN = 'TIER_ADMIN',
  GUEST = 'GUEST',
}
export class UserPaginationRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsEnum(TypeFilterRole)
  @ApiProperty({
    enum: TypeFilterRole,
    enumName: 'TypeFilterRole',
    required: false,
  })
  readonly role: TypeFilterRole;
}
