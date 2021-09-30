import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateDepartmentDto } from './update-department.dto';

export class UpdateDepartmentsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDepartmentDto)
  @ApiModelProperty({
    isArray: true,
    type: UpdateDepartmentDto,
  })
  readonly departments: UpdateDepartmentDto[];
}
