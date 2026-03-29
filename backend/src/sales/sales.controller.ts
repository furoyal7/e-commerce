import { Controller, Get, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './sale.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() saleData: Partial<Sale>): Promise<Sale> {
    return await this.salesService.create(saleData);
  }

  @Get()
  async findAll(): Promise<Sale[]> {
    return await this.salesService.findAll();
  }

  @Get('stats')
  async getStats(): Promise<{ totalValuation: number; saleCount: number }> {
    return await this.salesService.getStats();
  }
}
