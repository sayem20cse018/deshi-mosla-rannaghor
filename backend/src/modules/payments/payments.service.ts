import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

// ── SSLCommerz endpoints ──────────────────────────────────
const SSL_SANDBOX      = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSL_LIVE         = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSL_VERIFY_SANDBOX = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
const SSL_VERIFY_LIVE    = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

// ── Sentinel value — never a real userId ─────────────────
const GUEST_SENTINEL = '__GUEST__';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // ─────────────────────────────────────────────────────────
  // PRIVATE: build production-safe callback URLs
  // ─────────────────────────────────────────────────────────
  private getCallbackUrls(): {
    successUrl: string;
    failUrl:    string;
    cancelUrl:  string;
    ipnUrl:     string;
  } {
    const nodeEnv     = this.config.get<string>('NODE_ENV', 'development');
    const isProduction = nodeEnv === 'production';
    const frontendUrl  = this.stripTrailingSlash(
      this.config.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    );

    // Backend URL — required in production, optional in dev (falls back to localhost)
    let backendUrl = this.config.get<string>('BACKEND_URL', '');
    if (!backendUrl) {
      if (isProduction) {
        // Fail fast — never silently use localhost in production
        throw new InternalServerErrorException(
          'BACKEND_URL environment variable is required in production for SSLCommerz IPN callbacks.',
        );
      }
      // Development fallback
      const port = this.config.get<string>('PORT', '5000');
      backendUrl = `http://localhost:${port}`;
    }
    backendUrl = this.stripTrailingSlash(backendUrl);
    const apiPrefix = this.stripTrailingSlash(
      this.config.get<string>('API_PREFIX', 'api/v1'),
    );

    const successUrl = this.config.get<string>(
      'SSLCOMMERZ_SUCCESS_URL',
      `${frontendUrl}/payment/success`,
    );
    const failUrl = this.config.get<string>(
      'SSLCOMMERZ_FAIL_URL',
      `${frontendUrl}/payment/failed`,
    );
    const cancelUrl = this.config.get<string>(
      'SSLCOMMERZ_CANCEL_URL',
      `${frontendUrl}/payment/cancel`,
    );
    const ipnUrl = this.config.get<string>(
      'SSLCOMMERZ_WEBHOOK_URL',
      `${backendUrl}/${apiPrefix}/payments/webhook/sslcommerz`,
    );

    return { successUrl, failUrl, cancelUrl, ipnUrl };
  }

  private stripTrailingSlash(url: string): string {
    return url.replace(/\/+$/, '');
  }

  // ─────────────────────────────────────────────────────────
  // 1. INITIATE SSLCOMMERZ PAYMENT
  //    userId = real UUID for auth users
  //    userId = GUEST_SENTINEL for guest orders (userId IS NULL in DB)
  // ─────────────────────────────────────────────────────────
  async initiateSSLCommerzPayment(userId: string, dto: InitiatePaymentDto) {
    const isGuest = userId === GUEST_SENTINEL;

    // ── Load order with correct ownership check ───────────
    const order = await this.prisma.order.findFirst({
      where: isGuest
        // Guest: order must have no owner
        ? { id: dto.orderId, userId: null }
        // Auth:  order must belong to THIS user — prevents one user paying another's order
        : { id: dto.orderId, userId },
      include: { address: true, payment: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(
        isGuest
          ? 'Guest order not found.'
          : 'Order not found or does not belong to you.',
      );
    }
    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('This order has already been paid.');
    }
    if (order.paymentStatus === 'PROCESSING') {
      throw new BadRequestException('Payment is already in progress for this order.');
    }

    // ── Customer info ─────────────────────────────────────
    const customerName    = dto.customerName    ?? order.user?.name    ?? order.address.fullName;
    const customerEmail   = dto.customerEmail   ?? order.user?.email   ?? 'guest@deshimoslar.com';
    const customerPhone   = dto.customerPhone   ?? order.user?.phone   ?? order.address.phone;
    const customerAddress = dto.customerAddress ?? order.address.fullAddress;

    // ── Generate unique transaction ID ───────────────────
    const tran_id = `DMR-${order.orderNumber}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const storeId   = this.config.get<string>('SSLCOMMERZ_STORE_ID',       'testbox');
    const storePass = this.config.get<string>('SSLCOMMERZ_STORE_PASSWORD',  'qwerty');
    const isLive    = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';

    // ── Production-safe URLs (throws if BACKEND_URL missing in prod) ──
    const { successUrl, failUrl, cancelUrl, ipnUrl } = this.getCallbackUrls();

    this.logger.log(`SSLCommerz initiate: orderId=${order.id} ipnUrl=${ipnUrl}`);

    const params = new URLSearchParams({
      store_id:         storeId,
      store_passwd:     storePass,
      total_amount:     Number(order.totalAmount).toFixed(2),
      currency:         'BDT',
      tran_id,
      success_url:      successUrl,
      fail_url:         failUrl,
      cancel_url:       cancelUrl,
      ipn_url:          ipnUrl,
      cus_name:         customerName,
      cus_email:        customerEmail,
      cus_add1:         customerAddress,
      cus_city:         order.address.district,
      cus_state:        order.address.division,
      cus_postcode:     order.address.postalCode ?? '1000',
      cus_country:      'Bangladesh',
      cus_phone:        customerPhone,
      ship_name:        customerName,
      ship_add1:        customerAddress,
      ship_city:        order.address.district,
      ship_state:       order.address.division,
      ship_postcode:    order.address.postalCode ?? '1000',
      ship_country:     'Bangladesh',
      product_name:     `Deshi Moslar Rannaghar Order #${order.orderNumber}`,
      product_category: 'Grocery',
      product_profile:  'general',
      value_a:          order.id,           // orderId for IPN lookup
      value_b:          isGuest ? 'guest' : userId,
      value_c:          order.orderNumber,
      value_d:          isGuest ? 'guest' : 'auth',
    });

    // ── Mark payment PROCESSING + store tran_id ──────────
    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data:  { paymentStatus: 'PROCESSING', paymentMethod: dto.paymentMethod as any },
      });

      let paymentId: string;

      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: {
            transactionId: tran_id,
            paymentMethod: dto.paymentMethod as any,
            paymentStatus: 'PROCESSING',
            paymentRef:    tran_id,
          },
        });
        paymentId = order.payment.id;
      } else {
        const newPayment = await tx.payment.create({
          data: {
            orderId:       order.id,
            transactionId: tran_id,
            amount:        order.totalAmount,
            paymentMethod: dto.paymentMethod as any,
            paymentStatus: 'PROCESSING',
            paymentRef:    tran_id,
          },
        });
        paymentId = newPayment.id;
      }

      await tx.paymentTransaction.create({
        data: {
          paymentId,
          txnId:   tran_id,
          amount:  order.totalAmount,
          status:  'INITIATED',
          method:  dto.paymentMethod as any,
          gateway: 'SSLCOMMERZ',
        },
      });
    });

    // ── Call SSLCommerz API ───────────────────────────────
    const endpoint = isLive ? SSL_LIVE : SSL_SANDBOX;

    try {
      const response = await axios.post(endpoint, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      });

      const sslData = response.data;

      if (sslData?.status === 'SUCCESS' && sslData?.GatewayPageURL) {
        this.logger.log(`SSLCommerz initiated: tran_id=${tran_id}, order=${order.orderNumber}`);
        return {
          success:       true,
          gatewayUrl:    sslData.GatewayPageURL,
          transactionId: tran_id,
          sessionKey:    sslData.sessionkey,
          orderId:       order.id,
          orderNumber:   order.orderNumber,
          amount:        Number(order.totalAmount),
        };
      }

      await this.rollbackPaymentStatus(order.id);
      throw new BadRequestException(
        `Payment gateway error: ${sslData?.failedreason ?? 'Unknown error'}`,
      );
    } catch (err: any) {
      if (err instanceof BadRequestException || err instanceof InternalServerErrorException) throw err;
      await this.rollbackPaymentStatus(order.id);
      this.logger.error(`SSLCommerz init failed: ${err.message}`);
      throw new BadRequestException('Could not connect to payment gateway. Please try again.');
    }
  }

  // ─────────────────────────────────────────────────────────
  // 2. IPN WEBHOOK — idempotent, server-to-server
  // ─────────────────────────────────────────────────────────
  async handleSSLCommerzIPN(body: Record<string, any>) {
    const { tran_id, val_id, status, value_a: orderId } = body;

    this.logger.log(`IPN received: tran_id=${tran_id}, status=${status}, orderId=${orderId}`);

    if (!tran_id || !orderId) {
      this.logger.warn('IPN missing tran_id or orderId');
      return { received: true };
    }

    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: tran_id },
      include: { order: true },
    });

    if (!payment) {
      this.logger.warn(`IPN: payment not found for tran_id=${tran_id}`);
      return { received: true };
    }

    // Idempotency — skip if already finalized
    if (['PAID', 'FAILED', 'CANCELLED'].includes(payment.paymentStatus)) {
      this.logger.log(`IPN: already finalized (${payment.paymentStatus}), skipping`);
      return { received: true };
    }

    const isLive    = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
    const storeId   = this.config.get<string>('SSLCOMMERZ_STORE_ID',       'testbox');
    const storePass = this.config.get<string>('SSLCOMMERZ_STORE_PASSWORD',  'qwerty');
    const verifyEndpoint = isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX;

    let verified = false;
    let rawVerification: any = null;

    if (status === 'VALID' || status === 'VALIDATED') {
      try {
        const vRes = await axios.get(verifyEndpoint, {
          params: { val_id, store_id: storeId, store_passwd: storePass, format: 'json' },
          timeout: 10000,
        });
        rawVerification = vRes.data;
        verified = vRes.data?.status === 'VALID' || vRes.data?.status === 'VALIDATED';
        this.logger.log(`IPN SSL verify: ${vRes.data?.status}`);
      } catch (e: any) {
        this.logger.error(`IPN SSL verification failed: ${e.message}`);
      }
    }

    const txnStatus = verified ? 'SUCCESS'   : (status === 'FAILED' ? 'FAILED' : 'CANCELLED');
    const payStatus = verified ? 'PAID'      : (status === 'FAILED' ? 'FAILED' : 'CANCELLED');
    const ordStatus = verified ? 'CONFIRMED' : 'PENDING';

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus:   payStatus as any,
          gatewayTxnId:    val_id ?? tran_id,
          gatewayResponse: rawVerification ?? body,
          verifiedAt:      verified ? new Date() : undefined,
          paidAt:          verified ? new Date() : undefined,
          failedAt:        !verified ? new Date() : undefined,
          failureReason:   !verified ? `IPN status: ${status}` : undefined,
        },
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: payStatus as any,
          status:        ordStatus as any,
          confirmedAt:   verified ? new Date() : undefined,
        },
      });

      await tx.paymentTransaction.create({
        data: {
          paymentId:   payment.id,
          txnId:       tran_id,
          amount:      payment.amount,
          status:      txnStatus as any,
          method:      payment.paymentMethod,
          gateway:     'SSLCOMMERZ',
          rawResponse: body,
          ipnData:     rawVerification ?? body,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId:   payment.orderId,
          status:    ordStatus as any,
          note:      verified
            ? 'SSLCommerz payment verified via IPN'
            : `Payment failed via IPN: ${status}`,
          createdBy: 'PAYMENT_GATEWAY',
        },
      });
    });

    return { received: true };
  }

  // ─────────────────────────────────────────────────────────
  // 3. SUCCESS CALLBACK (browser redirect)
  // ─────────────────────────────────────────────────────────
  async handlePaymentSuccess(body: Record<string, any>) {
    const { tran_id, val_id, status, value_a: orderId } = body;

    if (!tran_id || status !== 'VALID') {
      return { success: false, orderId: orderId ?? null };
    }

    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: tran_id },
      include: { order: true },
    });

    if (!payment) return { success: false, orderId: orderId ?? null };

    // Already processed by IPN — idempotent
    if (payment.paymentStatus === 'PAID') {
      return { success: true, orderId: payment.orderId };
    }

    const isLive = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
    const verifyEndpoint = isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX;

    try {
      const vRes = await axios.get(verifyEndpoint, {
        params: {
          val_id,
          store_id:     this.config.get('SSLCOMMERZ_STORE_ID',      'testbox'),
          store_passwd: this.config.get('SSLCOMMERZ_STORE_PASSWORD', 'qwerty'),
          format:       'json',
        },
        timeout: 10000,
      });

      if (vRes.data?.status === 'VALID' || vRes.data?.status === 'VALIDATED') {
        await this.prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              paymentStatus: 'PAID',
              gatewayTxnId:  val_id,
              gatewayResponse: vRes.data,
              verifiedAt:    new Date(),
              paidAt:        new Date(),
            },
          });
          await tx.order.update({
            where: { id: payment.orderId },
            data:  { paymentStatus: 'PAID', status: 'CONFIRMED', confirmedAt: new Date() },
          });
          await tx.paymentTransaction.create({
            data: {
              paymentId:   payment.id,
              txnId:       tran_id,
              amount:      payment.amount,
              status:      'SUCCESS',
              method:      payment.paymentMethod,
              gateway:     'SSLCOMMERZ',
              rawResponse: vRes.data,
            },
          });
          await tx.orderStatusHistory.create({
            data: {
              orderId:   payment.orderId,
              status:    'CONFIRMED',
              note:      'Payment successful — order confirmed',
              createdBy: 'PAYMENT_GATEWAY',
            },
          });
        });
        return { success: true, orderId: payment.orderId };
      }
    } catch (e: any) {
      this.logger.error(`Success callback verify failed: ${e.message}`);
    }

    return { success: false, orderId: payment.orderId };
  }

  // ─────────────────────────────────────────────────────────
  // 4. FAIL CALLBACK
  // ─────────────────────────────────────────────────────────
  async handlePaymentFailed(body: Record<string, any>) {
    const { tran_id, value_a: orderId } = body;
    if (tran_id) await this.markPaymentFailed(tran_id, 'Payment failed at gateway');
    return { success: false, orderId: orderId ?? null };
  }

  // ─────────────────────────────────────────────────────────
  // 5. CANCEL CALLBACK
  // ─────────────────────────────────────────────────────────
  async handlePaymentCancelled(body: Record<string, any>) {
    const { tran_id, value_a: orderId } = body;
    if (tran_id) await this.markPaymentCancelled(tran_id);
    return { success: false, orderId: orderId ?? null };
  }

  // ─────────────────────────────────────────────────────────
  // 6. REFUND (auth users only — guest orders don't get refunds here)
  // ─────────────────────────────────────────────────────────
  async initiateRefund(orderId: string, userId: string, reason: string, amount?: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, order: { userId } },
      include: { order: true },
    });

    if (!payment) throw new NotFoundException('Payment record not found.');
    if (payment.paymentStatus !== 'PAID') {
      throw new BadRequestException('Refunds are only allowed for paid orders.');
    }

    const refundAmount = amount ?? Number(payment.amount);
    const isPartial    = refundAmount < Number(payment.amount);

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: isPartial ? 'PARTIALLY_REFUNDED' : 'REFUNDED',
          refundedAt:    new Date(),
          refundAmount,
          refundReason:  reason,
          refundTxnId:   `REF-${payment.transactionId}-${Date.now()}`,
        },
      });
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: isPartial ? 'PARTIALLY_REFUNDED' : 'REFUNDED',
          status:        'REFUNDED',
        },
      });
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status:    'REFUNDED',
          note:      `Refund initiated: ${reason}`,
          createdBy: 'SYSTEM',
        },
      });
    });

    return {
      success:      true,
      message:      'Refund process started.',
      refundAmount,
    };
  }

  // ─────────────────────────────────────────────────────────
  // 7. GET PAYMENT STATUS
  // ─────────────────────────────────────────────────────────
  async getPaymentStatus(orderId: string, userId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, order: { userId } },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });

    if (!payment) throw new NotFoundException('Payment record not found.');

    return {
      success: true,
      data: {
        ...payment,
        amount:          Number(payment.amount),
        refundAmount:    payment.refundAmount ? Number(payment.refundAmount) : null,
        gatewayResponse: undefined, // never expose raw gateway data
      },
    };
  }

  // ─────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────

  private async rollbackPaymentStatus(orderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data:  { paymentStatus: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY' },
    }).catch(() => {});
    await this.prisma.payment.updateMany({
      where: { orderId },
      data:  { paymentStatus: 'FAILED' },
    }).catch(() => {});
  }

  private async markPaymentFailed(tranId: string, reason: string) {
    const payment = await this.prisma.payment.findFirst({ where: { transactionId: tranId } });
    if (!payment || ['PAID', 'FAILED'].includes(payment.paymentStatus)) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data:  { paymentStatus: 'FAILED', failedAt: new Date(), failureReason: reason },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data:  { paymentStatus: 'FAILED' },
      });
      await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          txnId:     tranId,
          amount:    payment.amount,
          status:    'FAILED',
          method:    payment.paymentMethod,
          gateway:   'SSLCOMMERZ',
        },
      });
    });
  }

  private async markPaymentCancelled(tranId: string) {
    const payment = await this.prisma.payment.findFirst({ where: { transactionId: tranId } });
    if (!payment || ['PAID', 'CANCELLED'].includes(payment.paymentStatus)) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data:  { paymentStatus: 'CANCELLED' },
      });
      await tx.order.update({
        where: { id: payment.orderId },
        data:  { paymentStatus: 'CANCELLED' },
      });
      await tx.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          txnId:     tranId,
          amount:    payment.amount,
          status:    'CANCELLED',
          method:    payment.paymentMethod,
          gateway:   'SSLCOMMERZ',
        },
      });
    });
  }
}

// ── Export sentinel for use in orders.service.ts ─────────
export { GUEST_SENTINEL };
