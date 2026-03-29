import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check if product exists and is published
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.status !== ProductStatus.published) {
      throw new BadRequestException('Product is not available');
    }

    // Check stock
    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Increment Add-to-Cart Analytics
    await this.prisma.productAnalytics.upsert({
      where: { productId },
      create: { productId, addToCartCount: quantity },
      update: { addToCartCount: { increment: quantity } }
    });

    // Check if item already exists in cart
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException('Insufficient stock for requested quantity');
      }

      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: true,
        },
      });
    } else {
      // Create new cart item
      return this.prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: true,
        },
      });
    }
  }

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const now = new Date();
    
    // Calculate totals with dynamic pricing
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => {
        const product = item.product;
        let price = Number(product.price);
        
        // Handle sale price
        if (
          product.discount_price && 
          product.sale_start && product.sale_end &&
          now >= product.sale_start && now <= product.sale_end
        ) {
          price = Number(product.discount_price);
        }
        
        return sum + price * item.quantity;
      },
      0,
    );

    return {
      items: cartItems,
      totalItems,
      totalPrice,
      currency: cartItems[0]?.product?.currency || 'USD',
    };
  }

  async updateCartItem(userId: string, productId: string, updateCartDto: UpdateCartDto) {
    const { quantity } = updateCartDto;

    // Find cart item
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
         },
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    return this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async removeFromCart(userId: string, productId: string) {
    // Find cart item
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItem.id },
      include: {
        product: true,
      },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }

  async validateCartItems(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
    });

    const unavailableItems: any[] = [];

    for (const item of cartItems) {
      // Check if product still exists and is published
      if (!item.product || item.product.status !== ProductStatus.published) {
        unavailableItems.push({
          productId: item.productId,
          reason: 'Product not available',
        });
        continue;
      }

      // Check stock
      if (item.product.stock < item.quantity) {
        unavailableItems.push({
          productId: item.productId,
          reason: 'Insufficient stock',
          availableStock: item.product.stock,
        });
      }
    }

    return {
      isValid: unavailableItems.length === 0,
      unavailableItems,
    };
  }
}
