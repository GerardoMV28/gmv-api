import { Controller, Get } from '@nestjs/common';
import { ROLES } from '../common/constants/roles';
import { Roles } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
@Roles(ROLES.ADMIN)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('roles')
  roles() {
    return this.prisma.rol.findMany({
      where: { status: true },
      select: { id: true, description: true },
      orderBy: { id: 'asc' },
    });
  }
}
