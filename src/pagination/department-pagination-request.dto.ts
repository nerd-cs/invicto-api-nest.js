import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';
import { PaginationRequestDto } from './pagination-request.dto';

export class DepartmentPaginationRequestDto extends PaginationRequestDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  readonly companyId: number;
}
