import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateDepartmentDto } from '../../department/dto/create-department.dto';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly postalCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiModelProperty()
  readonly country: string;

  @IsOptional()
  @Type(() => CreateDepartmentDto)
  @ApiModelProperty({ required: false })
  readonly costCenter: CreateDepartmentDto;

  @IsOptional()
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
