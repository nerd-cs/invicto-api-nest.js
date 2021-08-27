import { Get, Req } from '@nestjs/common';
import { Controller, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiCookieAuth,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { TypePermission } from '../permission/permission.model';
import { LocationService } from './location.service';

@ApiTags('location')
@ApiCookieAuth()
@UseGuards(PermissionsGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiOperation({ summary: 'Get all locations for assigned company' })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  getAllForCompany(@Req() request) {
    return this.locationService.getAllForCompany(request.user);
  }
}
