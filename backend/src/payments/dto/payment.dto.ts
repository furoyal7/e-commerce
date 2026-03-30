import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  MOCK = 'mock',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class ProcessPaymentDto {
  @IsString()
  orderId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  paymentToken?: string;

  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;
}

export class PaymentResponseDto {
  success: boolean;
  message: string;
  status: PaymentStatus;
  transactionId?: string;
  paymentIntentId?: string;
  paymentId?: string;
}
