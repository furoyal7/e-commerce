import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
