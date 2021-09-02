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
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleDescription } from './response/schedule-description.response';
import { SchedulePage } from './response/schedule-page.response';
import { Schedule } from './schedule.model';
import { ScheduleService } from './schedule.service';

@ApiCookieAuth()
@ApiTags('schedule')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Create new schedule' })
  @ApiOkResponse({ description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @HttpCode(HttpStatus.OK)
  @Post()
  createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(createScheduleDto);
  }

  @ApiOperation({ summary: 'Get list of schedules' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    isArray: true,
    type: Schedule,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Get()
  getSchedulesList() {
    return this.scheduleService.getSchedulesList();
  }

  @ApiOperation({ summary: 'Get list of schedules with pagination' })
  @ApiOkResponse({ description: 'Successfully retrieved', type: SchedulePage })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Get('/list')
  getSchedulesPage(@Query() paginationDto: PaginationRequestDto) {
    return this.scheduleService.getSchedulesPage(paginationDto);
  }

  @ApiOperation({ summary: 'Get single schedule description' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: ScheduleDescription,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'scheduleId', required: true })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Get(':scheduleId')
  getScheduleDescription(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ) {
    if (!isPositive(scheduleId)) {
      throw new BadRequestException('scheduleId must be a positive number');
    }

    return this.scheduleService.getScheduleDescription(scheduleId);
  }

  @ApiOperation({ summary: 'Update the existing schedule' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Put()
  updateSchedule(@Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.updateSchedule(updateScheduleDto);
  }

  @ApiOperation({ summary: 'Delete the existing schedule' })
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'scheduleId', required: true })
  @Permissions(TypePermission.ACCESS_CONTROL_MANAGEMENT)
  @Delete(':scheduleId')
  deleteSchedule(@Param('scheduleId', ParseIntPipe) scheduleId: number) {
    if (!isPositive(scheduleId)) {
      throw new BadRequestException('scheduleId must be a positive number');
    }

    return this.scheduleService.deleteSchedule(scheduleId);
  }
}
