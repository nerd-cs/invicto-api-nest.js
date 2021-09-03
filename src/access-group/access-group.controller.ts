import {
  Body,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  BadRequestException,
  Controller,
  Get,
  Query,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { isPositive } from 'class-validator';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { TypePermission } from '../permission/permission.model';
import { AccessGroupService } from './access-group.service';
import { CreateAccessGroupDto } from './dto/create-access-group.dto';
import { UpdateAccessGroupDto } from './dto/update-access-group.dto';

@ApiCookieAuth()
@ApiTags('access group')
@Controller('accessgroup')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
export class AccessGroupController {
  constructor(private readonly accessGroupService: AccessGroupService) {}

  @ApiOperation({ summary: 'Get all access groups for specified location' })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'locationId', required: true })
  @Permissions(TypePermission.USER_MANAGEMENT)
  @Get()
  getAllForLocation(@Query('locationId', ParseIntPipe) locationId: number) {
    if (!isPositive(locationId)) {
      throw new BadRequestException('locationId must be a positive number');
    }

    return this.accessGroupService.getAllForLocation(locationId);
  }

  @ApiOperation({ summary: 'Create new access group' })
  @ApiOkResponse({ description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ALL_ACCESS)
  @HttpCode(HttpStatus.OK)
  @Post()
  createAccessGroup(@Body() createAccessGroupDto: CreateAccessGroupDto) {
    return this.accessGroupService.createAccessGroup(createAccessGroupDto);
  }

  @ApiOperation({ summary: 'Get list of access groups with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Permissions(TypePermission.ALL_ACCESS)
  @Get('/list')
  getAccessGroupsPage(@Query() paginationDto: PaginationRequestDto) {
    return this.accessGroupService.getAccessGroupsPage(paginationDto);
  }

  @ApiOperation({ summary: 'Update the existing access group' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ALL_ACCESS)
  @Put()
  updateAccessGroup(@Body() updateAccessGroupDto: UpdateAccessGroupDto) {
    return this.accessGroupService.updateAccessGroup(updateAccessGroupDto);
  }

  @ApiOperation({ summary: 'Delete the existing access group' })
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'accessGroupId', required: true })
  @Permissions(TypePermission.ALL_ACCESS)
  @Delete(':accessGroupId')
  deleteAccessGroup(
    @Param('accessGroupId', ParseIntPipe) accessGroupId: number,
  ) {
    if (!isPositive(accessGroupId)) {
      throw new BadRequestException('accessGroupId must be a positive number');
    }

    return this.accessGroupService.deleteAccessGroup(accessGroupId);
  }
}
