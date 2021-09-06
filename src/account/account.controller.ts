import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { AccountService } from './account.service';
import { Request } from 'express';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Permissions } from '../auth/decorator/permissions-auth.decorator';
import { TypePermission } from '../permission/permission.model';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { AccountResponse } from './response/account.response';

@ApiCookieAuth()
@ApiTags('account')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(PermissionsGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Get info about authenticated used' })
  @ApiOkResponse({
    description: 'Successfully retrieved',
    type: AccountResponse,
  })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCOUNT_MANAGEMENT)
  @Get()
  getAccountInfo(@Req() request: Request) {
    return this.accountService.getAccountInfo(request.user);
  }

  @ApiOperation({ summary: 'Update account of authenticated user' })
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiBadRequestResponse({ description: 'Invalid format for input parameters' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCOUNT_MANAGEMENT)
  @Put()
  updateAccount(@Body() dto: UpdateAccountDto, @Req() request: Request) {
    return this.accountService.updateAccount(dto, request.user);
  }

  @ApiOperation({ summary: 'Delete account of authenticated user' })
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Permissions(TypePermission.ACCOUNT_MANAGEMENT)
  @Delete()
  deleteAccount(@Req() request: Request) {
    const user = request.user;

    request.logout();

    return this.accountService.deleteAccount(user);
  }
}
