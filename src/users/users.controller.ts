import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './users.model';
import { Request } from 'express';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { PaginationRequestDto } from '../pagination/pagination-request.dto';

@Controller('users')
@UseGuards(RolesGuard)
@UseInterceptors(EntityAlreadyExistsInterceptor, InvalidEntityInterceptor)
@ApiCookieAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(TypeRole.ADMIN)
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
  @Roles(TypeRole.ADMIN)
  @Get('/list')
  getUsersPage(
    @Query() paginationDto: PaginationRequestDto,
    @Req() request: Request,
  ) {
    return this.userService.getUsersPage(request.user, paginationDto);
  }

  @Post()
  @Roles(TypeRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create new user' })
  @ApiOkResponse({ type: User, description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  createUser(@Body() userDto: CreateUserDto, @Req() request: Request) {
    return this.userService.createUser(userDto, request.user);
  }
}
