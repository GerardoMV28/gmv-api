import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { AUDIT_EVENT, AUDIT_SEVERITY } from '../common/constants/audit-events';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(userId: number, dto: CreateTaskDto, req: Request) {
    const task = await this.prisma.task.create({
      data: {
        name: dto.name,
        description: dto.description,
        priority: dto.priority,
        user_id: userId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });
    await this.audit.write({
      statusCode: 201,
      path: '/tasks',
      error: `Tarea #${task.id} creada`,
      errorCode: AUDIT_EVENT.TASK_CREATED,
      userId,
      eventType: AUDIT_EVENT.TASK_CREATED,
      severity: AUDIT_SEVERITY.INFO,
      req,
    });
    return task;
  }

  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { user_id: userId },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(userId: number, taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, user_id: userId },
    });
    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }
    return task;
  }

  async update(userId: number, taskId: number, dto: UpdateTaskDto, req: Request) {
    const result = await this.prisma.task.updateMany({
      where: { id: taskId, user_id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
        ...(dto.dueDate !== undefined
          ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }
          : {}),
        updatedAt: new Date(),
      },
    });
    if (result.count === 0) {
      throw new NotFoundException('Tarea no encontrada');
    }
    const task = await this.prisma.task.findFirstOrThrow({
      where: { id: taskId, user_id: userId },
    });
    await this.audit.write({
      statusCode: 200,
      path: `/tasks/${taskId}`,
      error: `Tarea #${taskId} actualizada`,
      errorCode: AUDIT_EVENT.TASK_UPDATED,
      userId,
      eventType: AUDIT_EVENT.TASK_UPDATED,
      severity: AUDIT_SEVERITY.INFO,
      req,
    });
    return task;
  }

  async remove(userId: number, taskId: number, req: Request) {
    const result = await this.prisma.task.deleteMany({
      where: { id: taskId, user_id: userId },
    });
    if (result.count === 0) {
      throw new NotFoundException('Tarea no encontrada');
    }
    await this.audit.write({
      statusCode: 200,
      path: `/tasks/${taskId}`,
      error: `Tarea #${taskId} eliminada`,
      errorCode: AUDIT_EVENT.TASK_DELETED,
      userId,
      eventType: AUDIT_EVENT.TASK_DELETED,
      severity: AUDIT_SEVERITY.INFO,
      req,
    });
    return { ok: true };
  }
}
