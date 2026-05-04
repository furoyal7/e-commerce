import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { ProcessPaymentDto, PaymentResponseDto, PaymentStatus, PaymentMethod } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  async processPayment(userId: string, processPaymentDto: ProcessPaymentDto): Promise<PaymentResponseDto> {
    const { orderId, paymentMethod, amount } = processPaymentDto;

    // Check if order exists and belongs to user
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PENDING' || order.paymentStatus === 'COMPLETED') {
      throw new BadRequestException('Order is not in a payable state');
    }

    // In a real application, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment
    const success = true; 
    const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;

    if (success) {
      // Update payment status in the database
      await this.ordersService.updatePaymentStatus(orderId, {
        paymentStatus: PaymentStatus.COMPLETED as any
      });

      return {
        success: true,
        message: 'Payment processed successfully',
        status: PaymentStatus.COMPLETED,
        transactionId,
        paymentId: transactionId
      };
    } else {
      await this.ordersService.updatePaymentStatus(orderId, {
        paymentStatus: PaymentStatus.FAILED as any
      });

      return {
        success: false,
        message: 'Payment failed',
        status: PaymentStatus.FAILED
      };
    }
  }

  async getPaymentMethods() {
    return [
      {
        id: PaymentMethod.CREDIT_CARD,
        name: 'Credit Card',
        description: 'Pay with your credit card',
        icon: 'credit-card'
      },
      {
        id: PaymentMethod.PAYPAL,
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: 'paypal'
      },
      {
        id: PaymentMethod.STRIPE,
        name: 'Stripe',
        description: 'Secure payment via Stripe',
        icon: 'stripe'
      },
      {
        id: PaymentMethod.MOCK,
        name: 'Mock Payment',
        description: 'Simulated payment for testing',
        icon: 'test'
      }
    ];
  }

  async refundPayment(orderId: string, userId: string, isAdmin = false) {
    const where = isAdmin ? { id: orderId } : { id: orderId, userId };

    const order = await this.prisma.order.findFirst({
      where,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus !== 'COMPLETED') {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    // Simulate refund processing
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.REFUNDED as any,
        status: 'CANCELLED' as any
      }
    });

    return {
      success: true,
      message: 'Refund processed successfully',
      status: PaymentStatus.REFUNDED
    };
  }
}
