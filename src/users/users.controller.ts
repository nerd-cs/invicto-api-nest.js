import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './users.model';

@Controller('users')
@UseGuards(RolesGuard)
@UseInterceptors(EntityAlreadyExistsInterceptor)
@ApiCookieAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles(TypeRole.ADMIN)
  @ApiOperation({ summary: 'Retrieve list of all users' })
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Successfully retrieved',
  })
  @ApiUnauthorizedResponse({ description: 'User is unauthorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  getAll() {
    return this.userService.getAll();
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
  createUser(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }
}
