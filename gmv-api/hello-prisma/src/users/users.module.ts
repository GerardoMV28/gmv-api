import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { AdminController } from '../admin/admin.controller';
import { AdminUsersController, UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuditModule],
  controllers: [UsersController, AdminUsersController, AdminController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
