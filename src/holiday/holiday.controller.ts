import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiCookieAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { isPositive } from 'class-validator';
import { TypePermission } from '../permission/permission.model';
import { Holiday } from './holiday.model';
import { HolidayPage } from './response/holiday-page.response';

@ApiCookieAuth()
@ApiTags('holiday')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('holiday')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @ApiOperation({ summary: 'Create new holiday' })
  @ApiOkResponse({ description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @HttpCode(HttpStatus.OK)
  @Post()
  createHoliday(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @ApiOperation({ summary: 'Get all holidays' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    isArray: true,
    type: Holiday,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Get()
  getAllHolidays() {
    return this.holidayService.getAllHolidays();
  }

  @ApiOperation({ summary: 'Get list of holidays with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved', type: HolidayPage })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Get('/list')
  getHolidaysPage(@Query() paginationDto: PaginationRequestDto) {
    return this.holidayService.getHolidaysPage(paginationDto);
  }

  @ApiOperation({ summary: 'Update the existing holiday' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Put()
  updateHoliday(@Body() updateHolidayDto: UpdateHolidayDto) {
    return this.holidayService.updateHoliday(updateHolidayDto);
  }

  @ApiOperation({ summary: 'Delete the existing holiday' })
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'holidayId', required: true })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Delete(':holidayId')
  deleteHoliday(@Param('holidayId', ParseIntPipe) holidayId: number) {
    if (!isPositive(holidayId)) {
      throw new BadRequestException('holidayId must be a positive number');
    }

    return this.holidayService.deleteHoliday(holidayId);
  }
}
