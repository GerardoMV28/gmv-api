import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AUDIT_EVENT, AUDIT_SEVERITY } from '../common/constants/audit-events';
import { ROLES } from '../common/constants/roles';
import type { AuthUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rol: true },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return this.toSelfProfile(user);
  }

  async updateMe(userId: number, dto: UpdateProfileDto) {
    if (dto.email) {
      const taken = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id: userId } },
      });
      if (taken) {
        throw new ConflictException('El correo ya está en uso');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.lastname !== undefined ? { lastname: dto.lastname } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
      },
      include: { rol: true },
    });
    return this.toSelfProfile(user);
  }

  async findOne(viewer: AuthUser, targetId: number) {
    if (viewer.userId === targetId) {
      const user = await this.prisma.user.findUnique({
        where: { id: targetId },
        include: { rol: true },
      });
      if (!user) {
        throw new NotFoundException();
      }
      return this.toSelfProfile(user);
    }
    if (viewer.role !== ROLES.ADMIN) {
      throw new ForbiddenException('No puedes consultar el perfil de otro usuario');
    }
    const user = await this.prisma.user.findUnique({
      where: { id: targetId },
      include: { rol: true },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return this.toPublicProfile(user);
  }

  async listForAdmin() {
    const users = await this.prisma.user.findMany({
      include: { rol: true },
      orderBy: { id: 'asc' },
    });
    return users.map((u) => this.toPublicProfile(u));
  }

  async updateUserRole(
    admin: AuthUser,
    targetUserId: number,
    rolId: number,
    req: Request,
  ) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: { rol: true },
    });
    if (!target) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const newRol = await this.prisma.rol.findFirst({
      where: { id: rolId, status: true },
    });
    if (!newRol) {
      throw new NotFoundException('Rol inválido');
    }

    const previous = target.rol?.description ?? ROLES.USER;

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { rol_id: rolId },
      include: { rol: true },
    });

    await this.audit.write({
      statusCode: 200,
      path: `/admin/users/${targetUserId}/role`,
      error: `Rol ${previous} -> ${updated.rol?.description}`,
      errorCode: AUDIT_EVENT.ROLE_CHANGED,
      userId: admin.userId,
      eventType: AUDIT_EVENT.ROLE_CHANGED,
      severity: AUDIT_SEVERITY.INFO,
      req,
    });

    return this.toPublicProfile(updated);
  }

  private toSelfProfile(user: {
    id: number;
    name: string;
    lastname: string;
    username: string;
    email: string | null;
    lastLogin: Date | null;
    created_dt: Date;
    isActive: boolean | null;
    rol_id: number | null;
    rol: { description: string } | null;
  }) {
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      lastLogin: user.lastLogin,
      created_dt: user.created_dt,
      isActive: user.isActive,
      rolId: user.rol_id,
      role: user.rol?.description ?? ROLES.USER,
    };
  }

  private toPublicProfile(user: {
    id: number;
    name: string;
    lastname: string;
    username: string;
    created_dt: Date;
    isActive: boolean | null;
    rol_id: number | null;
    rol: { description: string } | null;
  }) {
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      username: user.username,
      created_dt: user.created_dt,
      isActive: user.isActive,
      rolId: user.rol_id,
      role: user.rol?.description ?? ROLES.USER,
    };
  }
}
