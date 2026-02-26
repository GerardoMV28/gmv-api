import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AUDIT_EVENT, AUDIT_SEVERITY } from '../common/constants/audit-events';
import { ROLES } from '../common/constants/roles';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AUTH_COOKIE } from './auth.constants';

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto, req: Request, res: Response) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, ...(dto.email ? [{ email: dto.email }] : [])],
      },
    });
    if (existing) {
      throw new ConflictException('Usuario o correo ya registrado');
    }

    const userCount = await this.prisma.user.count();
    const userRol = await this.prisma.rol.findFirst({
      where: { description: ROLES.USER, status: true },
    });
    const adminRol = await this.prisma.rol.findFirst({
      where: { description: ROLES.ADMIN, status: true },
    });
    if (!userRol || !adminRol) {
      throw new ConflictException('Roles no inicializados. Ejecuta prisma db seed');
    }

    const assignedRolId = userCount === 0 ? adminRol.id : userRol.id;
    const hash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        lastname: dto.lastname,
        username: dto.username,
        email: dto.email ?? null,
        password: hash,
        rol_id: assignedRolId,
      },
      include: { rol: true },
    });

    await this.audit.write({
      statusCode: 201,
      path: '/auth/register',
      error: `Usuario ${user.username} registrado`,
      errorCode: AUDIT_EVENT.REGISTER,
      userId: user.id,
      eventType: AUDIT_EVENT.REGISTER,
      severity: AUDIT_SEVERITY.INFO,
      req,
    });

    const role = user.rol?.description ?? ROLES.USER;
    const token = this.jwt.sign({ sub: user.id, role });
    const secure = process.env.NODE_ENV === 'production';
    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return this.buildUserResponse(user);
  }

  async login(dto: LoginDto, req: Request, res: Response) {
    const user = await this.prisma.user.findFirst({
      where: { username: dto.username },
      include: { rol: true },
    });

    if (!user || user.isActive === false) {
      await this.audit.write({
        statusCode: 401,
        path: '/auth/login',
        error: 'Intento de inicio de sesión fallido',
        errorCode: AUDIT_EVENT.LOGIN_FAILED,
        userId: null,
        eventType: AUDIT_EVENT.LOGIN_FAILED,
        severity: AUDIT_SEVERITY.WARN,
        req,
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      await this.audit.write({
        statusCode: 401,
        path: '/auth/login',
        error: 'Intento de inicio de sesión fallido',
        errorCode: AUDIT_EVENT.LOGIN_FAILED,
        userId: user.id,
        eventType: AUDIT_EVENT.LOGIN_FAILED,
        severity: AUDIT_SEVERITY.WARN,
        req,
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const role = user.rol?.description ?? ROLES.USER;
    const token = this.jwt.sign({ sub: user.id, role });

    const secure = process.env.NODE_ENV === 'production';
    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    await this.audit.write({
      statusCode: 200,
      path: '/auth/login',
      error: 'Login exitoso',
      errorCode: AUDIT_EVENT.LOGIN_SUCCESS,
      userId: user.id,
      eventType: AUDIT_EVENT.LOGIN_SUCCESS,
      severity: AUDIT_SEVERITY.INFO,
      req,
    });

    const fresh = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      include: { rol: true },
    });
    return this.buildUserResponse(fresh);
  }

  logout(res: Response) {
    const secure = process.env.NODE_ENV === 'production';
    res.clearCookie(AUTH_COOKIE, { path: '/', httpOnly: true, secure, sameSite: 'lax' });
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rol: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.buildUserResponse(user);
  }

  private buildUserResponse(user: {
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
}
