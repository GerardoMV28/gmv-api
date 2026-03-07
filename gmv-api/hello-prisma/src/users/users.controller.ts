import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ROLES } from '../common/constants/roles';
import { CurrentUser, type AuthUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: AuthUser) {
    return this.users.getMe(user.userId);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.userId, dto);
  }

  @Get()
  @Roles(ROLES.ADMIN)
  list(@CurrentUser() _user: AuthUser) {
    return this.users.listForAdmin();
  }

  @Get(':id')
  findOne(
    @CurrentUser() viewer: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.users.findOne(viewer, id);
  }
}

@Controller('admin/users')
@Roles(ROLES.ADMIN)
export class AdminUsersController {
  constructor(private readonly users: UsersService) {}

  @Patch(':id/role')
  updateRole(
    @CurrentUser() admin: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: Request,
  ) {
    return this.users.updateUserRole(admin, id, dto.rolId, req);
  }
}
