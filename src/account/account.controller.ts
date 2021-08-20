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
import { Roles } from '../auth/decorator/roles-auth.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { InvalidEntityInterceptor } from '../interceptor/invalid-entity.interceptor';
import { TypeRole } from '../roles/roles.model';
import { AccountService } from './account.service';
import { Request } from 'express';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiCookieAuth()
@ApiTags('account')
@UseInterceptors(InvalidEntityInterceptor)
@UseGuards(RolesGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Get info about authenticated used' })
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiUnauthorizedResponse({ description: 'User is not authorized' })
  @ApiForbiddenResponse({
    description: "User doesn't have permissions to access this resource",
  })
  @Roles(TypeRole.MEMBER, TypeRole.TIER_ADMIN, TypeRole.ADMIN)
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
  @Roles(TypeRole.MEMBER, TypeRole.TIER_ADMIN, TypeRole.ADMIN)
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
  @Roles(TypeRole.MEMBER, TypeRole.TIER_ADMIN, TypeRole.ADMIN)
  @Delete()
  deleteAccount(@Req() request: Request) {
    const user = request.user;

    request.logout();

    return this.accountService.deleteAccount(user);
  }
}
