import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { TypePermission } from '../permission/permission.model';
import { CompanyService } from './company.service';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { Request } from 'express';
import { Company } from './company.model';
import { CompanyPage } from './response/company-page.response';

@ApiCookieAuth()
@ApiTags('company')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @ApiOperation({ summary: 'Get all companies' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: Company,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.USER_MANAGEMENT)
  @Get()
  getAllCompanies(@Req() request: Request) {
    return this.companyService.getAllCompanies(request.user);
  }

  @ApiOperation({ summary: 'Get list of companies with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved', type: CompanyPage })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.COMPANY_MANAGEMENT)
  @Get('/list')
  getCompanyPage(@Query() paginationDto: PaginationRequestDto) {
    return this.companyService.getCompanyPage(paginationDto);
  }
}
