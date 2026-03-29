import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async create(data: Partial<Sale>): Promise<Sale> {
    const sale = this.saleRepository.create(data);
    return await this.saleRepository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return await this.saleRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getStats(): Promise<{ totalValuation: number; saleCount: number }> {
    const result = await this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.amount)', 'total')
      .addSelect('COUNT(sale.id)', 'count')
      .getRawOne();

    return {
      totalValuation: parseFloat(result.total) || 0,
      saleCount: parseInt(result.count) || 0,
    };
  }
}
