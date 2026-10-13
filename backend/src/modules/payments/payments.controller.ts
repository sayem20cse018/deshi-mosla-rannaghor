import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  HttpCode,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  // ── 1. INITIATE ONLINE PAYMENT ────────────────────────
  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Initiate SSLCommerz payment for an order' })
  initiatePayment(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiateSSLCommerzPayment(userId, dto);
  }

  // ── 2. IPN WEBHOOK (server-to-server, no auth) ────────
  @Public()
  @Post('webhook/sslcommerz')
  @HttpCode(200)
  @ApiOperation({ summary: 'SSLCommerz IPN webhook endpoint' })
  async sslCommerzIPN(@Body() body: Record<string, any>) {
    return this.paymentsService.handleSSLCommerzIPN(body);
  }

  // ── 3. SUCCESS REDIRECT (browser POST from SSLCommerz) ─
  @Public()
  @Post('success')
  @HttpCode(200)
  @ApiOperation({ summary: 'SSLCommerz payment success callback' })
  async paymentSuccess(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const result = await this.paymentsService.handlePaymentSuccess(body);

    if (result.success && result.orderId) {
      return res.redirect(`${frontendUrl}/order/${result.orderId}/confirmation?paid=true`);
    }
    return res.redirect(`${frontendUrl}/payment/failed?order_id=${result.orderId ?? ''}`);
  }

  // ── 4. FAIL REDIRECT ──────────────────────────────────
  @Public()
  @Post('failed')
  @HttpCode(200)
  @ApiOperation({ summary: 'SSLCommerz payment failed callback' })
  async paymentFailed(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const result = await this.paymentsService.handlePaymentFailed(body);
    return res.redirect(`${frontendUrl}/payment/failed?order_id=${result.orderId ?? ''}`);
  }

  // ── 5. CANCEL REDIRECT ────────────────────────────────
  @Public()
  @Post('cancel')
  @HttpCode(200)
  @ApiOperation({ summary: 'SSLCommerz payment cancel callback' })
  async paymentCancel(
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const result = await this.paymentsService.handlePaymentCancelled(body);
    return res.redirect(`${frontendUrl}/payment/cancel?order_id=${result.orderId ?? ''}`);
  }

  // ── 6. GET PAYMENT STATUS ─────────────────────────────
  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get payment status for an order' })
  getPaymentStatus(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentsService.getPaymentStatus(orderId, userId);
  }

  // ── 7. REQUEST REFUND ─────────────────────────────────
  @Post('refund/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Request a refund for a paid order' })
  requestRefund(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
    @Body('reason') reason: string,
    @Body('amount') amount?: number,
  ) {
    return this.paymentsService.initiateRefund(orderId, userId, reason, amount);
  }
}
