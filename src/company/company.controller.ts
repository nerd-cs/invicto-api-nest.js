import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
  ApiParam,
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
import { CreateCompanyDto } from './dto/create-company.dto';
import { isPositive } from 'class-validator';
import { UpdateCompanyDto } from './dto/update-company.dto';
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

  @ApiOperation({ summary: 'Create new company' })
  @ApiOkResponse({ description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.COMPANY_MANAGEMENT)
  @HttpCode(HttpStatus.OK)
  @Post()
  createCompany(@Body() dto: CreateCompanyDto, @Req() request: Request) {
    return this.companyService.createCompany(dto, request.user);
  }

  @ApiOperation({ summary: 'Update the existing company' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.COMPANY_MANAGEMENT)
  @Put()
  updateCompany(@Body() dto: UpdateCompanyDto, @Req() request: Request) {
    return this.companyService.updateCompany(dto, request.user);
  }

  @ApiOperation({ summary: 'Delete the existing company' })
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'companyId', required: true })
  @Permissions(TypePermission.COMPANY_MANAGEMENT)
  @Delete(':companyId')
  deleteCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Req() request: Request,
  ) {
    if (!isPositive(companyId)) {
      throw new BadRequestException('companyId must be a positive number');
    }

    return this.companyService.deleteCompany(companyId, request.user);
  }
}
