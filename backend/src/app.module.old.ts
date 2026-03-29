import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogModule } from './audit/audit-log.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // ⚠️ dev only
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    AuthModule,
    AuditLogModule,
    UsersModule,

    ProductsModule,
    SalesModule,


  ],
})
export class AppModule {}