import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto, UpdateOrderStatusDto, UpdatePaymentStatusDto, OrderStatus, PaymentStatus } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { shippingAddress } = createOrderDto;

    // Get user's cart
    const cart = await this.cartService.getCart(userId);
    
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate cart items (stock and availability)
    const validation = await this.cartService.validateCartItems(userId);
    if (!validation.isValid) {
      throw new BadRequestException('Some items in your cart are no longer available: ' + JSON.stringify(validation.unavailableItems));
    }

    // Calculate total price
    const totalPrice = cart.totalPrice;

    // Create order with transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING as any,
          paymentStatus: PaymentStatus.PENDING as any,
          totalPrice,
          currency: cart.currency,
          shippingAddress,
        },
      });

      // Create order items and update stock
      const orderItems = await Promise.all(
        cart.items.map(async (item) => {
          // Create order item
          const orderItem = await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            },
          });

          // Update product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          return orderItem;
        }),
      );

      // Clear cart
      await this.cartService.clearCart(userId);

      return newOrder;
    });

    // Return order with items
    return this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, isAdmin = false) {
    const where = isAdmin ? {} : { userId };

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        user: isAdmin ? {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string, isAdmin = false) {
    const where = isAdmin ? { id } : { id, userId };

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: isAdmin ? {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        } : false,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    const { status } = updateOrderStatusDto;

    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Validate status transitions
    this.validateStatusTransition(order.status as any, status);

    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updatePaymentStatus(id: string, updatePaymentStatusDto: UpdatePaymentStatusDto) {
    const { paymentStatus } = updatePaymentStatusDto;

    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update payment status
    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // If payment is completed, update order status to PAID and increment analytics
    if (paymentStatus === PaymentStatus.COMPLETED && order.status === 'PENDING') {
      await this.prisma.order.update({
        where: { id: id },
        data: { status: 'PAID' as any },
      });

      // Increment Purchase Count Analytics
      for (const item of updatedOrder.items) {
        await this.prisma.productAnalytics.upsert({
          where: { productId: item.productId },
          create: { productId: item.productId, purchaseCount: item.quantity },
          update: { purchaseCount: { increment: item.quantity } }
        });
      }
    }

    return updatedOrder;
  }

  async cancelOrder(id: string, userId: string, isAdmin = false) {
    const where = isAdmin ? { id } : { id, userId };

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if order can be cancelled
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // Restore stock and cancel order
    await this.prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id },
        data: { 
          status: 'CANCELLED' as any,
          paymentStatus: 'FAILED' as any,
        },
      });
    });

    return { message: 'Order cancelled successfully' };
  }

  private validateStatusTransition(currentStatus: any, newStatus: OrderStatus) {
    const validTransitions: Record<string, OrderStatus[]> = {
      'PENDING': [OrderStatus.PAID, OrderStatus.CANCELLED],
      'PAID': [OrderStatus.SHIPPED],
      'SHIPPED': [OrderStatus.DELIVERED],
      'DELIVERED': [], // Final state
      'CANCELLED': [], // Final state
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(`Cannot transition from ${currentStatus} to ${newStatus}`);
    }
  }
}
