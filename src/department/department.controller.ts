import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { TypePermission } from '../permission/permission.model';
import { DepartmentService } from './department.service';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { Request } from 'express';
import { isPositive } from 'class-validator';
import { DepartmentResponse } from './response/department.response';
import { DepartmentPage } from './response/department-page.response';
import { DepartmentPaginationRequestDto } from '../pagination/department-pagination-request.dto';

@ApiCookieAuth()
@ApiTags('department')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiOperation({ summary: 'Get departments for selected company' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: DepartmentResponse,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'companyId', required: true })
  @ApiQuery({ name: 'costCenter', required: false, type: 'boolean' })
  @Permissions(TypePermission.USER_MANAGEMENT)
  @Get()
  getAllForCompany(
    @Query('companyId', ParseIntPipe) companyId: number,
    @Query('costCenter', new DefaultValuePipe(false), ParseBoolPipe)
    costCenter: boolean,
    @Req() request: Request,
  ) {
    if (!isPositive(companyId)) {
      throw new BadRequestException('companyId must be a positive number');
    }

    return this.departmentService.getAllForCompany(
      request.user,
      companyId,
      costCenter,
    );
  }

  @ApiOperation({
    summary: 'Get departments for selected company with pagination',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: DepartmentPage,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.COMPANY_MANAGEMENT)
  @Get('/list')
  getDeparmentsPage(
    @Query() dto: DepartmentPaginationRequestDto,
    @Req() request: Request,
  ) {
    return this.departmentService.getDepartmentsPage(dto, request.user);
  }
}
