import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { CategoriesModule } from '../categories/categories.module';
import { OrdersModule } from '../orders/orders.module';
import { CartModule } from '../cart/cart.module';
import { ProductsModule } from '../products/products.module';
import { PrismaModule } from '../common/prisma.module';

@Module({
  imports: [
    CategoriesModule, 
    OrdersModule, 
    CartModule, 
    ProductsModule,
    PrismaModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
