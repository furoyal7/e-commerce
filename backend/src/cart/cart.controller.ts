import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  async updateCartItem(
    @Request() req,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, productId, updateCartItemDto);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  async removeFromCart(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req.user.id, productId);
  }

  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

}
