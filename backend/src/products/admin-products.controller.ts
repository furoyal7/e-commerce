import { Controller, Post, Body, UseGuards, Request, UseInterceptors, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { AdminGuard } from '../common/admin.guard';
import { Roles } from '../common/roles.decorator';
import { IdentityInterceptor } from '../common/identity.interceptor';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, AdminGuard)
@Roles('ADMIN')
@UseInterceptors(IdentityInterceptor)
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return await this.productsService.create(createProductDto, req.user?.userId);
  }

  @Get()
  async findAll() {
    return await this.productsService.findAll({ isAdmin: true });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: any, @Request() req) {
    return await this.productsService.update(id, updateData, req.user?.userId);
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string, @Request() req) {
    return await this.productsService.update(id, { status: 'published' }, req.user?.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return await this.productsService.remove(id, req.user?.userId);
  }
}
