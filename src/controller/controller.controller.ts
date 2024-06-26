import {
  BadRequestException,
  Body,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { isPositive } from 'class-validator';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { TypePermission } from '../permission/permission.model';
import { ControllerService } from './controller.service';
import { UpdateControllerDto } from './dto/update-controller.dto';
import { ControllerPage } from './response/controller-page.response';

@ApiCookieAuth()
@ApiTags('controller')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('controller')
export class ControllerController {
  constructor(private readonly controllerService: ControllerService) {}

  @ApiOperation({ summary: 'Get list of controllers with pagination' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: ControllerPage,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.HARDWARE_MANAGEMENT)
  @Get('/list')
  getControllerPage(@Query() paginationDto: PaginationRequestDto) {
    return this.controllerService.getControllerPage(paginationDto);
  }

  @ApiOperation({ summary: 'Update the existing controller' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.HARDWARE_MANAGEMENT)
  @Put()
  updateController(@Body() updateControllerDto: UpdateControllerDto) {
    return this.controllerService.updateController(updateControllerDto);
  }

  @ApiOperation({ summary: 'Test the existing controller' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'controllerId' })
  @Permissions(TypePermission.HARDWARE_MANAGEMENT)
  @Put('/:controllerId/test')
  testController(@Param('controllerId', ParseIntPipe) controllerId: number) {
    if (!isPositive(controllerId)) {
      throw new BadRequestException('controllerId must be a positive number');
    }

    return this.controllerService.testController(controllerId);
  }
}
