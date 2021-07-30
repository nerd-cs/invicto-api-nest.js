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
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { TypeRole } from '../roles/roles.model';
import { DoorService } from './door.service';
import { UpdateDoorDto } from './dto/update-door.dto';

@ApiCookieAuth()
@ApiTags('door')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(RolesGuard)
@Controller('door')
export class DoorController {
  constructor(private readonly doorService: DoorService) {}

  @ApiOperation({ summary: 'Get all doors for specified location' })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'locationId', required: true })
  @Roles(TypeRole.ADMIN)
  @Get()
  getAllForLocation(@Query('locationId', ParseIntPipe) locationId: number) {
    if (!isPositive(locationId)) {
      throw new BadRequestException('locationId must be a positive number');
    }

    return this.doorService.getAllForLocation(locationId);
  }

  @ApiOperation({ summary: 'Get list of doors with pagination' })
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
  getSchedulesPage(@Query() paginationDto: PaginationRequestDto) {
    return this.doorService.getDoorPage(paginationDto);
  }

  @ApiOperation({ summary: 'Update the existing door' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Roles(TypeRole.ADMIN)
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
  @Roles(TypeRole.ADMIN)
  @Put('/:doorId/test')
  testDoor(@Param('doorId', ParseIntPipe) doorId: number) {
    if (!isPositive(doorId)) {
      throw new BadRequestException('doorId must be a positive number');
    }

    return this.doorService.testDoor(doorId);
  }
}
