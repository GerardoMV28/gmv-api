import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

export type AuditWriteParams = {
  statusCode: number;
  path: string;
  error: string;
  errorCode: string;
  userId?: number | null;
  eventType: string;
  severity: string;
  req?: Request;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async write(params: AuditWriteParams): Promise<void> {
    const ip =
      (params.req?.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      params.req?.socket?.remoteAddress ||
      '';
    const userAgent =
      typeof params.req?.headers['user-agent'] === 'string'
        ? params.req.headers['user-agent']
        : null;

    await this.prisma.logs.create({
      data: {
        statusCode: params.statusCode,
        path: params.path.slice(0, 200),
        error: params.error.slice(0, 200),
        errorCode: params.errorCode.slice(0, 200),
        sesion_id: params.userId ?? null,
        eventType: params.eventType.slice(0, 50),
        severity: params.severity.slice(0, 20),
        ipAddress: ip.slice(0, 45),
        userAgent,
      },
    });
  }
}
