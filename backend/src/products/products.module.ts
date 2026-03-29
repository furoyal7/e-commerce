import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../common/prisma.module';
import { AuditLogModule } from '../audit/audit-log.module';

@Module({
  imports: [PrismaModule, AuditLogModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
