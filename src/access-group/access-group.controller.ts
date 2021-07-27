import { ParseIntPipe } from '@nestjs/common';
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { isPositive } from 'class-validator';
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { TypeRole } from '../roles/roles.model';
import { AccessGroupService } from './access-group.service';

@ApiCookieAuth()
@ApiTags('access group')
@Controller('accessgroup')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(RolesGuard)
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
  @Roles(TypeRole.ADMIN)
  @Get()
  getAllForLocation(@Query('locationId', ParseIntPipe) locationId: number) {
    if (!isPositive(locationId)) {
      throw new BadRequestException('locationId must be a positive number');
    }

    return this.accessGroupService.getAllForLocation(locationId);
  }
}
