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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { isPositive } from 'class-validator';
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { TypeRole } from '../roles/roles.model';
import { ControllerService } from './controller.service';
import { UpdateControllerDto } from './dto/update-controller.dto';

@ApiCookieAuth()
@ApiTags('controller')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(RolesGuard)
@Controller('controller')
export class ControllerController {
  constructor(private readonly controllerService: ControllerService) {}

  @ApiOperation({ summary: 'Get list of controllers with pagination' })
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
    return this.controllerService.getControllerPage(paginationDto);
  }

  @ApiOperation({ summary: 'Update the existing controller' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Roles(TypeRole.ADMIN)
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
  @Roles(TypeRole.ADMIN)
  @Put('/:controllerId/test')
  testController(@Param('controllerId', ParseIntPipe) controllerId: number) {
    if (!isPositive(controllerId)) {
      throw new BadRequestException('controllerId must be a positive number');
    }

    return this.controllerService.testController(controllerId);
  }
}
