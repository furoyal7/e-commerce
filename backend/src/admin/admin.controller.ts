import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';
import { CategoriesService } from '../categories/categories.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { PrismaService } from '../common/prisma.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
  async getStats() {
    const [
      totalProducts,
      publishedProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'published' } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      totalProducts,
      publishedProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get full product analytics' })
  async getAnalytics() {
    const analytics = await this.prisma.productAnalytics.findMany({
      include: {
        product: {
          select: { name: true, slug: true, status: true }
        }
      },
      orderBy: { views: 'desc' },
      take: 20
    });

    const topSelling = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    });

    return {
      productViews: analytics,
      topSelling: topSelling
    };
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products (admin)' })
  async getAllProducts(@Query() query: any) {
    return this.productsService.findAll({ ...query, isAdmin: true });
  }

  @Post('products/bulk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute bulk action on products' })
  async bulkAction(@Body() body: { ids: string[], action: string, data?: any }, @Request() req: any) {
    return this.productsService.bulkAction(body.ids, body.action, body.data, req.user.userId);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders (admin)' })
  async getAllOrders() {
    return this.ordersService.findAll('', true);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.ordersService.updateOrderStatus(id, body);
  }

  @Get('users')
  @Roles(UserRole.SUPER_ADMIN) // Only Super Admin can view all users
  @ApiOperation({ summary: 'Get all users (Super Admin only)' })
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories (admin)' })
  async getAllCategories() {
    return this.categoriesService.findAll();
  }
}
