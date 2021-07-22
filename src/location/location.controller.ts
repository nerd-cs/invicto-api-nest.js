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
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { TypeRole } from '../roles/roles.model';
import { LocationService } from './location.service';

@ApiTags('location')
@ApiCookieAuth()
@UseGuards(RolesGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @Roles(TypeRole.ADMIN)
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
