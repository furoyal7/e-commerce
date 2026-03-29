import { Module, Global } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { PrismaModule } from '../common/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
