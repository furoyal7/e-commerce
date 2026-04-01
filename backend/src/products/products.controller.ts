import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, Query, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { AdminGuard } from '../common/admin.guard';
import { Roles } from '../common/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 1. CREATE PRODUCT (Admin) - POST /api/products
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  async create(@Body() productData: CreateProductDto, @Request() req): Promise<any> {
    const product = await this.productsService.create(productData, req.user?.userId);
    return {
      success: true,
      product,
    };
  }

  // 3. GET PRODUCTS (Frontend) - GET /api/products
  @Get()
  async findAll(
    @Query('all') all?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const showAll = all === 'true'; 
    const products = await this.productsService.findAll({ 
      status: showAll ? undefined : 'published' as any,
      search,
      category,
    });
    return {
      success: true,
      products,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateData: UpdateProductDto, @Request() req): Promise<any> {
    const product = await this.productsService.update(id, updateData, req.user?.userId);
    return {
      success: true,
      product,
    };
  }

  // 2. PUBLISH PRODUCT - PATCH /api/products/:id/publish
  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  async publish(@Param('id') id: string) {
    const product = await this.productsService.update(id, { status: 'published' });
    return {
      success: true,
      product,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    const product = await this.productsService.findOne(id, true); // Track view
    return {
      success: true,
      product,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string, @Request() req): Promise<any> {
    await this.productsService.remove(id, req.user?.userId);
    return {
      success: true,
      message: 'Product deleted',
    };
  }
}
