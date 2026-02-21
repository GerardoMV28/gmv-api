import { Controller, Get, Query } from '@nestjs/common';
import { ROLES } from '../common/constants/roles';
import { Roles } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('audit')
@Roles(ROLES.ADMIN)
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('logs')
  async list(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('userId') userId?: string,
    @Query('eventType') eventType?: string,
    @Query('severity') severity?: string,
  ) {
    const where: Record<string, unknown> = {};
    if (from || to) {
      where.timeStamp = {};
      if (from) (where.timeStamp as Record<string, Date>).gte = new Date(from);
      if (to) (where.timeStamp as Record<string, Date>).lte = new Date(to);
    }
    if (userId !== undefined && userId !== '') {
      const id = Number(userId);
      if (!Number.isNaN(id)) {
        where.sesion_id = id;
      }
    }
    if (eventType) {
      where.eventType = eventType;
    }
    if (severity) {
      where.severity = severity;
    }

    return this.prisma.logs.findMany({
      where,
      orderBy: { timeStamp: 'desc' },
      take: 200,
      select: {
        id: true,
        statusCode: true,
        timeStamp: true,
        path: true,
        error: true,
        errorCode: true,
        sesion_id: true,
        eventType: true,
        severity: true,
        ipAddress: true,
        userAgent: true,
      },
    });
  }
}
