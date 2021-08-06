import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { TypeRole } from '../roles/roles.model';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityAlreadyExistsInterceptor } from './interceptor/entity-already-exists.interceptor';
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
import { User } from './users.model';
import { Request } from 'express';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { isPositive } from 'class-validator';

@Controller('users')
@UseInterceptors(EntityAlreadyExistsInterceptor, InvalidEntityInterceptor)
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Retrieve list of all users for assigned company' })
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Successfully retrieved',
  })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  getAll(@Req() request: Request) {
    return this.userService.getAll(request.user);
  }

  @ApiOperation({
    summary: 'Get list of users for assigned company with pagination',
  })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'limit' })
  @ApiCookieAuth()
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @Get('/list')
  getUsersPage(
    @Query() paginationDto: PaginationRequestDto,
    @Req() request: Request,
  ) {
    return this.userService.getUsersPage(request.user, paginationDto);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new user' })
  @ApiOkResponse({ type: User, description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  createUser(@Body() userDto: CreateUserDto, @Req() request: Request) {
    const originHeader = request.header('origin');

    return this.userService.createUser(userDto, request.user, originHeader);
  }

  @Put('/:userId/invite')
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Invite user' })
  @ApiOkResponse({ type: User, description: 'Successfully invited' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiParam({ name: 'userId', required: true })
  inviteUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    const originHeader = request.header('origin');

    return this.userService.inviteUser(userId, originHeader);
  }

  @Put('/confirm')
  @ApiOperation({ summary: 'Complete user registration' })
  @ApiOkResponse({ type: User, description: 'Successfully completed' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  completeRegistration(
    @Body() completeRegistrationDto: CompleteRegistrationDto,
  ) {
    return this.userService.completeRegistration(completeRegistrationDto);
  }
}
