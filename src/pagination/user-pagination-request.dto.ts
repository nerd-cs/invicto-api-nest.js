import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TypeRole } from '../roles/roles.model';
import { PaginationRequestDto } from './pagination-request.dto';

export class UserPaginationRequestDto extends PaginationRequestDto {
  @IsOptional()
  @IsEnum(TypeRole)
  @ApiProperty({ enum: TypeRole, enumName: 'TypeRole', required: false })
  readonly role: TypeRole;
}
