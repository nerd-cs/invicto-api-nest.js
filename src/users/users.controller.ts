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
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityAlreadyExistsInterceptor } from './interceptor/entity-already-exists.interceptor';
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
import { User } from './users.model';
import { Request } from 'express';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { CompleteRegistrationDto } from './dto/complete-registration.dto';
import { isNumber, isPositive, isString } from 'class-validator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserPaginationRequestDto } from '../pagination/user-pagination-request.dto';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { ChangeUserStatusDto } from './dto/change-user-status.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UpdateAccessGroupsDto } from './dto/update-user-access-groups.dto';
import { ChangeActivenessDto } from './dto/change-activeness.dto';
import { UpdateUserCardDto } from './dto/update-user-card.dto';
import { CreateUserCardsDto } from './dto/create-user-cards.dto';
import { TypePermission } from '../permission/permission.model';
import { UserResponse } from './response/user.response';
import { UserPage } from './response/user-page.response';
import { UserInfo } from './response/user-info.response';
import { AccessGroupPerLocation } from '../access-group/response/access-group-per-location.response';

@Controller('users')
@UseInterceptors(EntityAlreadyExistsInterceptor, InvalidEntityInterceptor)
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Retrieve list of all users for assigned company' })
  @ApiOkResponse({
    type: UserResponse,
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
  @ApiOkResponse({ description: 'Successfully retrieved', type: UserPage })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiCookieAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
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
  @ApiOkResponse({ description: 'Successfully retrieved', type: UserInfo })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiCookieAuth()
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
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
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
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
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update the existing user' })
  @ApiOkResponse({ type: User, description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  updateUser(@Body() userDto: UpdateUserDto, @Req() request: Request) {
    this.validateDtoForUpdate(userDto);

    return this.userService.updateUserInfo(userDto, request.user);
  }

  private validateDtoForUpdate(dto: UpdateUserDto) {
    if (dto.profilePicture && !isString(dto.profilePicture)) {
      throw new BadRequestException('profilePicture must be a valid string');
    }

    if (
      dto.departmentId &&
      (!isNumber(dto.departmentId) || !isPositive(dto.departmentId))
    ) {
      throw new BadRequestException(
        'departmentId must be a valid positive number',
      );
    }

    if (
      dto.costCenterId &&
      (!isNumber(dto.costCenterId) || !isPositive(dto.costCenterId))
    ) {
      throw new BadRequestException(
        'costCenterId must be a valid positive number',
      );
    }
  }

  @Post('/collaborator')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
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
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
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
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Archive, activate or deactivate user' })
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

  @Get('/:userId/accessgroups')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get access groups for selected user' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: AccessGroupPerLocation,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  getUserAccessGroups(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    return this.userService.getUserAccessGroups(userId, request.user);
  }

  @Put('/:userId/accessgroups')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user access groups' })
  @ApiOkResponse({ type: User, description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  updateUserAccessGroups(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
    @Body() dto: UpdateAccessGroupsDto,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    return this.userService.updateUserAccessGroups(userId, request.user, dto);
  }

  @Put('/:userId/accessgroups/:accessGroupId')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({
    summary: "Update activeness for selected user's access group",
  })
  @ApiOkResponse({ type: User, description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  @ApiParam({ name: 'accessGroupId', required: true })
  changeAccessGroupActiveness(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('accessGroupId', ParseIntPipe) accessGroupId: number,
    @Req() request: Request,
    @Body() dto: ChangeActivenessDto,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    if (!isPositive(accessGroupId)) {
      throw new BadRequestException('accessGroupId must be a positive number');
    }

    return this.userService.changeAccessGroupActiveness(
      userId,
      accessGroupId,
      request.user,
      dto,
    );
  }

  @Delete('/:userId/accessgroups/:accessGroupId')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({
    summary: "Unlink selected user's access group",
  })
  @ApiOkResponse({ type: User, description: 'Successfully performed' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  @ApiParam({ name: 'accessGroupId', required: true })
  unlinkUserAccessGroup(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('accessGroupId', ParseIntPipe) accessGroupId: number,
    @Req() request: Request,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    if (!isPositive(accessGroupId)) {
      throw new BadRequestException('accessGroupId must be a positive number');
    }

    return this.userService.unlinkUserAccessGroup(
      userId,
      accessGroupId,
      request.user,
    );
  }

  @Post('/:userId/cards')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.KEY_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Create new user cards' })
  @ApiOkResponse({ type: User, description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  createUserCards(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
    @Body() dto: CreateUserCardsDto,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    return this.userService.createUserCards(userId, request.user, dto);
  }

  @Put('/:userId/cards')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.KEY_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user card' })
  @ApiOkResponse({ type: User, description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  updateUserCards(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
    @Body() dto: UpdateUserCardDto,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    return this.userService.updateUserCards(userId, request.user, dto);
  }

  @Put('/:userId/cards/:cardId')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.KEY_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({
    summary: "Update activeness for selected user's card",
  })
  @ApiOkResponse({ type: User, description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  @ApiParam({ name: 'cardId', required: true })
  changeCardActiveness(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Req() request: Request,
    @Body() dto: ChangeActivenessDto,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    if (!isPositive(cardId)) {
      throw new BadRequestException('cardId must be a positive number');
    }

    return this.userService.changeCardActiveness(
      userId,
      cardId,
      request.user,
      dto,
    );
  }

  @Delete('/:userId/cards/:cardId')
  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.KEY_MANAGEMENT)
  @ApiCookieAuth()
  @ApiOperation({
    summary: "Delete selected user's card",
  })
  @ApiOkResponse({ type: User, description: 'Successfully deleted' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @ApiParam({ name: 'userId', required: true })
  @ApiParam({ name: 'cardId', required: true })
  deleteUserCard(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Req() request: Request,
  ) {
    if (!isPositive(userId)) {
      throw new BadRequestException('userId must be a positive number');
    }

    if (!isPositive(cardId)) {
      throw new BadRequestException('cardId must be a positive number');
    }

    return this.userService.deleteUserCard(userId, cardId, request.user);
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

  @UseGuards(PermissionsGuard)
  @Permissions(TypePermission.USER_MANAGEMENT)
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
