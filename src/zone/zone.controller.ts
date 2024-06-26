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
import { ZonePage } from './response/zone-page.response';
import { Zone } from './zone.model';
import { ZoneService } from './zone.service';

@ApiCookieAuth()
@ApiTags('zone')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @ApiOperation({ summary: 'Get all zones for specified location' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    isArray: true,
    type: Zone,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'locationId' })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Get()
  getAllForLocation(@Query('locationId', ParseIntPipe) locationId: number) {
    if (!isPositive(locationId)) {
      throw new BadRequestException('locationId must be a positive number');
    }

    return this.zoneService.getAllForLocation(locationId);
  }

  @ApiOperation({ summary: 'Get list of zones with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved', type: ZonePage })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
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
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
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
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
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
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Delete('/:zoneId')
  deleteZone(@Param('zoneId', ParseIntPipe) zoneId: number) {
    if (!isPositive(zoneId)) {
      throw new BadRequestException('zoneId must be a positive number');
    }

    return this.zoneService.deleteZone(zoneId);
  }
}
