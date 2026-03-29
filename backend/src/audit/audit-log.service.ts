import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: any): Promise<any> {
    const { action, target, targetId, adminId, metadata } = entry;
    return await this.prisma.auditLog.create({
      data: {
        action,
        target,
        targetId,
        adminId: adminId ? String(adminId) : null,
        metadata: metadata || {},
      },
    });
  }
}
