import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // e.g., 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT'

  @Column()
  target: string; // e.g., 'Product'

  @Column()
  targetId: string;

  @Column({ nullable: true })
  adminId: number;

  @Column('jsonb', { nullable: true })
  metadata: any; // Store old values/new values for change tracking

  @CreateDateColumn()
  timestamp: Date;
}
