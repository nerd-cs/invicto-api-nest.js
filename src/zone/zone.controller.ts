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
  ApiCookieAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { isPositive } from 'class-validator';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { TypePermission } from '../permission/permission.model';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ZoneService } from './zone.service';

@ApiCookieAuth()
@ApiTags('zone')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @ApiOperation({ summary: 'Get all zones for specified location' })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'locationId' })
  @Permissions(TypePermission.ALL_ACCESS)
  @Get()
  getAllForLocation(@Query('locationId', ParseIntPipe) locationId: number) {
    if (!isPositive(locationId)) {
      throw new BadRequestException('locationId must be a positive number');
    }

    return this.zoneService.getAllForLocation(locationId);
  }

  @ApiOperation({ summary: 'Get list of zones with pagination' })
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
  getZonesPage(@Query() paginationDto: PaginationRequestDto, @Req() request) {
    return this.zoneService.getZonesPage(paginationDto, request.user);
  }

  @ApiOperation({ summary: 'Create new zone' })
  @ApiOkResponse({ description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ALL_ACCESS)
  @HttpCode(HttpStatus.OK)
  @Post()
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.zoneService.createZone(createZoneDto);
  }

  @ApiOperation({ summary: 'Update the existing zone' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ALL_ACCESS)
  @Put()
  updateZone(@Body() updateZoneDto: UpdateZoneDto) {
    return this.zoneService.updateZone(updateZoneDto);
  }

  @ApiOperation({ summary: 'Delete the existing zone' })
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'zoneId', required: true })
  @Permissions(TypePermission.ALL_ACCESS)
  @Delete('/:zoneId')
  deleteZone(@Param('zoneId', ParseIntPipe) zoneId: number) {
    if (!isPositive(zoneId)) {
      throw new BadRequestException('zoneId must be a positive number');
    }

    return this.zoneService.deleteZone(zoneId);
  }
}
