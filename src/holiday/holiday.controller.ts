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
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { TypeRole } from '../roles/roles.model';
import { RolesGuard } from '../auth/guard/roles.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { isPositive } from 'class-validator';

@ApiCookieAuth()
@ApiTags('holiday')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(RolesGuard)
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
  @Roles(TypeRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post()
  createHoliday(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @ApiOperation({ summary: 'Get all holidays' })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Roles(TypeRole.ADMIN)
  @Get()
  getAllHolidays() {
    return this.holidayService.getAllHolidays();
  }

  @ApiOperation({ summary: 'Get list of holidays with pagination' })
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
  @Roles(TypeRole.ADMIN)
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
  @Roles(TypeRole.ADMIN)
  @Delete(':holidayId')
  deleteHoliday(@Param('holidayId', ParseIntPipe) holidayId: number) {
    if (!isPositive(holidayId)) {
      throw new BadRequestException('holidayId must be a positive number');
    }

    return this.holidayService.deleteHoliday(holidayId);
  }
}
