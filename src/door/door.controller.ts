import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
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
} from '@nestjs/swagger';
import { isPositive } from 'class-validator';
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { EntityNotFoundInterceptor } from '../interceptor/entity-not-found.interceptor';
import { TypeRole } from '../roles/roles.model';
import { DoorService } from './door.service';

@ApiCookieAuth()
@ApiTags('door')
@UseInterceptors(EntityNotFoundInterceptor)
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
}
