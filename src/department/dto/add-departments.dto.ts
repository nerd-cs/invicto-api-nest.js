import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import { IsArray, ValidateIf, ValidateNested } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

export class AddDepartmentsDto {
  @ValidateIf((dto) => dto.costCenter || !dto.departments)
  @Type(() => CreateDepartmentDto)
  @ApiModelProperty({ required: false })
  readonly costCenter: CreateDepartmentDto;

  @ValidateIf((dto) => dto.departments || !dto.costCenter)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDepartmentDto)
  @ApiModelProperty({
    required: false,
    isArray: true,
    type: CreateDepartmentDto,
  })
  readonly departments: CreateDepartmentDto[];
}
