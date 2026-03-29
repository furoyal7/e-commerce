import { IsString, IsEnum } from 'class-validator';

export class ProcessPaymentDto {
  @IsString()
  orderId: string;

  @IsEnum(['stripe', 'paypal', 'mock'])
  paymentMethod: string;

  @IsString()
  paymentToken?: string; // For real payment methods
}

export class PaymentResponseDto {
  success: boolean;
  message: string;
  paymentId?: string;
  redirectUrl?: string;
}
