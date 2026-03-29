import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto, PaymentResponseDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.guard';
import { UserRole } from '../auth/dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process payment for an order' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Order not payable or payment failed' })
  processPayment(
    @Request() req: AuthenticatedRequest,
    @Body() processPaymentDto: ProcessPaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.processPayment(req.user.userId, processPaymentDto);
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  getPaymentMethods() {
    return this.paymentsService.getPaymentMethods();
  }

  @Post(':orderId/refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refund payment for an order' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Payment cannot be refunded' })
  refundPayment(@Request() req: AuthenticatedRequest, @Param('orderId') orderId: string) {
    return this.paymentsService.refundPayment(orderId, req.user.userId);
  }

  @Post(':orderId/refund/admin')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refund any payment (Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  refundPaymentAdmin(@Param('orderId') orderId: string) {
    return this.paymentsService.refundPayment(orderId, '', true);
  }
}
