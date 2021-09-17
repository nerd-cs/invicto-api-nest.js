import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
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
import { Door } from './door.model';
import { DoorService } from './door.service';
import { UpdateDoorDto } from './dto/update-door.dto';
import { DoorInfo } from './response/door-info.response';
import { DoorPage } from './response/door-page.response';

@ApiCookieAuth()
@ApiTags('door')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('door')
export class DoorController {
  constructor(private readonly doorService: DoorService) {}

  @ApiOperation({ summary: 'Get all doors for specified location' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: Door,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'locationId', required: true })
  @Permissions(
    TypePermission.ACCESS_CONTROL_MANAGEMENT,
    TypePermission.HARDWARE_MANAGEMENT,
  )
  @Get()
  getAllForLocation(@Query('locationId', ParseIntPipe) locationId: number) {
    if (!isPositive(locationId)) {
      throw new BadRequestException('locationId must be a positive number');
    }

    return this.doorService.getAllForLocation(locationId);
  }

  @ApiOperation({ summary: 'Get list of doors with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved', type: DoorPage })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.HARDWARE_MANAGEMENT)
  @Get('/list')
  getDoorsPage(@Query() paginationDto: PaginationRequestDto) {
    return this.doorService.getDoorPage(paginationDto);
  }

  @ApiOperation({ summary: 'Update the existing door' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.HARDWARE_MANAGEMENT)
  @Put()
  updateDoor(@Body() updateDoorDto: UpdateDoorDto) {
    return this.doorService.updateDoor(updateDoorDto);
  }

  @ApiOperation({ summary: 'Test the existing door' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'doorId' })
  @Permissions(TypePermission.HARDWARE_MANAGEMENT)
  @Put('/:doorId/test')
  testDoor(@Param('doorId', ParseIntPipe) doorId: number) {
    if (!isPositive(doorId)) {
      throw new BadRequestException('doorId must be a positive number');
    }

    return this.doorService.testDoor(doorId);
  }

  @ApiOperation({ summary: 'Get info about selected door' })
  @ApiOkResponse({ description: 'Successfully retrieved', type: DoorInfo })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'doorId' })
  @Permissions(TypePermission.HARDWARE_MANAGEMENT)
  @Get('/:doorId')
  getDoorInfo(@Param('doorId', ParseIntPipe) doorId: number) {
    if (!isPositive(doorId)) {
      throw new BadRequestException('doorId must be a positive number');
    }

    return this.doorService.getDoorInfo(doorId);
  }
}
