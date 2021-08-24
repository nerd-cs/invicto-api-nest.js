import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { AssignLocationDto } from './assign-location.dto';

export class UpdateAccessGroupsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AssignLocationDto)
  @ApiModelProperty({ isArray: true, type: AssignLocationDto })
  readonly locations: AssignLocationDto[];
}
