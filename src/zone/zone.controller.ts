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
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { EntityNotFoundInterceptor } from '../interceptor/entity-not-found.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { TypeRole } from '../roles/roles.model';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ZoneService } from './zone.service';

@ApiCookieAuth()
@ApiTags('zone')
@UseInterceptors(EntityNotFoundInterceptor)
@UseGuards(RolesGuard)
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
  @Roles(TypeRole.ADMIN)
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
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @Roles(TypeRole.ADMIN)
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
  @Roles(TypeRole.ADMIN)
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
  @Roles(TypeRole.ADMIN)
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
  @Roles(TypeRole.ADMIN)
  @Delete('/:zoneId')
  deleteZone(@Param('zoneId', ParseIntPipe) zoneId: number) {
    if (!isPositive(zoneId)) {
      throw new BadRequestException('zoneId must be a positive number');
    }

    return this.zoneService.deleteZone(zoneId);
  }
}
