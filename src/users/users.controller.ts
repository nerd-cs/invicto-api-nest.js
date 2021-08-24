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
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { isPositive } from 'class-validator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserPaginationRequestDto } from '../pagination/user-pagination-request.dto';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { UpdateUserDto } from './dto/update-user-dto';

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
    @Query() paginationDto: UserPaginationRequestDto,
    @Req() request: Request,
  ) {
    return this.userService.getUsersPage(request.user, paginationDto);
  }

  @ApiOperation({
    summary: 'Get info about selected user',
  })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiCookieAuth()
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @Get('/:userId')
  getUserInfo(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    return this.userService.getUserInfo(userId, request.user);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new user with access to building' })
  @ApiOkResponse({ type: User, description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  createUser(@Body() userDto: CreateUserDto, @Req() request: Request) {
    return this.userService.createUser(userDto, request.user);
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update the existing user' })
  @ApiOkResponse({ type: User, description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  updateUser(@Body() userDto: UpdateUserDto, @Req() request: Request) {
    return this.userService.updateUserInfo(userDto, request.user);
  }

  @Post('/collaborator')
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Create new collaborator with access to the platform',
  })
  @ApiOkResponse({ type: User, description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  createCollaborator(
    @Body() userDto: CreateCollaboratorDto,
    @Req() request: Request,
  ) {
    const originHeader = request.header('origin');

    return this.userService.createCollaborator(
      userDto,
      request.user,
      originHeader,
    );
  }

  @Put('/:userId/invite')
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Invite user' })
  @ApiOkResponse({ type: User, description: 'Successfully invited' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  inviteUser(@Param('userId', ParseIntPipe) userId: number) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    return this.userService.inviteUser(userId);
  }

  @Put('/:userId/status')
  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Archive or deactivate user' })
  @ApiOkResponse({ type: User, description: 'Successfully performed' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  changeUserStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
    @Body() dto: ChangeUserStatusDto,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    return this.userService.changeUserStatus(userId, request.user, dto);
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

  @Put('/password/reset')
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiOkResponse({ description: 'Successfully completed' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Req() request: Request,
  ) {
    const originHeader = request.header('origin');

    return this.userService.resetPassword(resetPasswordDto, originHeader);
  }

  @UseGuards(RolesGuard)
  @Roles(TypeRole.ADMIN)
  @Put('/:userId/password/reset')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Send password reset email for selected user' })
  @ApiOkResponse({ description: 'Successfully completed' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  resetPasswordForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    const originHeader = request.header('origin');

    return this.userService.resetPasswordForUser(userId, originHeader);
  }

  @Put('/password/confirm')
  @ApiOperation({ summary: 'Confirm new password' })
  @ApiOkResponse({ description: 'Successfully completed' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  confirmPassword(@Body() confirmPasswordDto: CompleteRegistrationDto) {
    return this.userService.confirmPassword(confirmPasswordDto);
  }
}
