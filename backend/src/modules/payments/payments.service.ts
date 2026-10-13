import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

// ── SSLCommerz endpoint ───────────────────────────────────
const SSL_SANDBOX = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSL_LIVE    = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSL_VERIFY_SANDBOX = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
const SSL_VERIFY_LIVE    = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // ── 1. INITIATE SSLCOMMERZ PAYMENT ───────────────────
  async initiateSSLCommerzPayment(userId: string, dto: InitiatePaymentDto) {
    // Load order — must belong to this user
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
      include: { address: true, payment: true, user: true },
    });

    if (!order) throw new NotFoundException('অর্ডারটি পাওয়া যায়নি');
    if (order.paymentStatus === 'PAID') {
      throw new BadRequestException('এই অর্ডারটি ইতিমধ্যে পরিশোধ করা হয়েছে');
    }
    if (order.paymentStatus === 'PROCESSING') {
      throw new BadRequestException('পেমেন্ট ইতিমধ্যে প্রক্রিয়াধীন আছে');
    }

    // Generate unique transaction ID (prevents duplicate payment)
    const tran_id = `DMR-${order.orderNumber}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const storeId  = this.config.get<string>('SSLCOMMERZ_STORE_ID',  'testbox');
    const storePass= this.config.get<string>('SSLCOMMERZ_STORE_PASSWORD', 'qwerty');
    const isLive   = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const backendUrl  = `http://localhost:${this.config.get('PORT', '5000')}/api/v1`;

    const successUrl = this.config.get<string>('SSLCOMMERZ_SUCCESS_URL', `${frontendUrl}/payment/success`);
    const failUrl    = this.config.get<string>('SSLCOMMERZ_FAIL_URL',    `${frontendUrl}/payment/failed`);
    const cancelUrl  = this.config.get<string>('SSLCOMMERZ_CANCEL_URL',  `${frontendUrl}/payment/cancel`);
    const ipnUrl     = this.config.get<string>('SSLCOMMERZ_WEBHOOK_URL', `${backendUrl}/payments/webhook/sslcommerz`);

    const customerName    = dto.customerName    ?? order.user?.name    ?? order.address.fullName;
    const customerEmail   = dto.customerEmail   ?? order.user?.email   ?? 'customer@deshimoslar.com';
    const customerPhone   = dto.customerPhone   ?? order.user?.phone   ?? order.address.phone;
    const customerAddress = dto.customerAddress ?? order.address.fullAddress;

    const params = new URLSearchParams({
      store_id:       storeId,
      store_passwd:   storePass,
      total_amount:   Number(order.totalAmount).toFixed(2),
      currency:       'BDT',
      tran_id,
      success_url:    successUrl,
      fail_url:       failUrl,
      cancel_url:     cancelUrl,
      ipn_url:        ipnUrl,
      cus_name:       customerName,
      cus_email:      customerEmail,
      cus_add1:       customerAddress,
      cus_city:       order.address.district,
      cus_state:      order.address.division,
      cus_postcode:   order.address.postalCode ?? '1000',
      cus_country:    'Bangladesh',
      cus_phone:      customerPhone,
      ship_name:      customerName,
      ship_add1:      customerAddress,
      ship_city:      order.address.district,
      ship_state:     order.address.division,
      ship_postcode:  order.address.postalCode ?? '1000',
      ship_country:   'Bangladesh',
      product_name:   `Deshi Moslar Rannaghar Order #${order.orderNumber}`,
      product_category: 'Grocery',
      product_profile:  'general',
      value_a:        order.id,      // store orderId for IPN lookup
      value_b:        userId,
      value_c:        order.orderNumber,
      value_d:        '',
    });

    // ── Mark payment as PROCESSING + store tran_id ────
    await this.prisma.$transaction(async (tx) => {
      // Update order payment status
      await tx.order.update({
        where: { id: order.id },
        data:  { paymentStatus: 'PROCESSING', paymentMethod: dto.paymentMethod as any },
      });

      // Upsert Payment record
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
      } else {
        await tx.payment.create({
          data: {
            orderId:       order.id,
            transactionId: tran_id,
            amount:        order.totalAmount,
            paymentMethod: dto.paymentMethod as any,
            paymentStatus: 'PROCESSING',
            paymentRef:    tran_id,
          },
        });
      }

      // Create PaymentTransaction log
      await tx.paymentTransaction.create({
        data: {
          paymentId: (order.payment?.id ?? (await tx.payment.findUnique({ where: { orderId: order.id } }))!.id),
          txnId:     tran_id,
          amount:    order.totalAmount,
          status:    'INITIATED',
          method:    dto.paymentMethod as any,
          gateway:   'SSLCOMMERZ',
        },
      });
    });

    // ── Call SSLCommerz API ───────────────────────────
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
          success:        true,
          gatewayUrl:     sslData.GatewayPageURL,
          transactionId:  tran_id,
          sessionKey:     sslData.sessionkey,
          orderId:        order.id,
          orderNumber:    order.orderNumber,
          amount:         Number(order.totalAmount),
        };
      }

      // SSLCommerz returned failure — rollback to PENDING
      await this.rollbackPaymentStatus(order.id);
      throw new BadRequestException(
        `পেমেন্ট গেটওয়ে সংযোগ ব্যর্থ হয়েছে: ${sslData?.failedreason ?? 'Unknown error'}`,
      );
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      await this.rollbackPaymentStatus(order.id);
      this.logger.error(`SSLCommerz init failed: ${err.message}`);
      throw new BadRequestException('পেমেন্ট গেটওয়ের সাথে সংযোগ করা যাচ্ছে না। পরে চেষ্টা করুন।');
    }
  }

  // ── 2. SSLCOMMERZ IPN WEBHOOK (server-to-server) ─────
  async handleSSLCommerzIPN(body: Record<string, any>) {
    const { tran_id, val_id, status, amount, currency, value_a: orderId } = body;

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

    // Idempotency: skip if already finalized
    if (['PAID', 'FAILED', 'CANCELLED'].includes(payment.paymentStatus)) {
      this.logger.log(`IPN: already finalized (${payment.paymentStatus}), skipping`);
      return { received: true };
    }

    // Verify with SSLCommerz validation API
    const isLive = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
    const verifyEndpoint = isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX;
    const storeId   = this.config.get<string>('SSLCOMMERZ_STORE_ID',  'testbox');
    const storePass = this.config.get<string>('SSLCOMMERZ_STORE_PASSWORD', 'qwerty');

    let verified = false;
    let rawVerification: any = null;

    if (status === 'VALID' || status === 'VALIDATED') {
      try {
        const vRes = await axios.get(verifyEndpoint, {
          params: {
            val_id,
            store_id:     storeId,
            store_passwd: storePass,
            format:       'json',
          },
          timeout: 10000,
        });
        rawVerification = vRes.data;
        verified = vRes.data?.status === 'VALID' || vRes.data?.status === 'VALIDATED';
        this.logger.log(`SSL verify: ${vRes.data?.status}`);
      } catch (e: any) {
        this.logger.error(`SSL verification failed: ${e.message}`);
      }
    }

    const txnStatus = verified ? 'SUCCESS' : (status === 'FAILED' ? 'FAILED' : 'CANCELLED');
    const payStatus = verified ? 'PAID'    : (status === 'FAILED' ? 'FAILED' : 'CANCELLED');
    const ordStatus = verified ? 'CONFIRMED' : 'PENDING';

    await this.prisma.$transaction(async (tx) => {
      // Update Payment
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

      // Update Order
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: payStatus as any,
          status:        ordStatus as any,
          confirmedAt:   verified ? new Date() : undefined,
        },
      });

      // Log transaction
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

      // Order status history
      await tx.orderStatusHistory.create({
        data: {
          orderId:   payment.orderId,
          status:    ordStatus as any,
          note:      verified ? 'SSLCommerz পেমেন্ট যাচাই সম্পন্ন' : `পেমেন্ট ব্যর্থ: ${status}`,
          createdBy: 'PAYMENT_GATEWAY',
        },
      });
    });

    return { received: true };
  }

  // ── 3. SUCCESS CALLBACK (browser redirect from SSLCommerz) ──
  async handlePaymentSuccess(body: Record<string, any>) {
    const { tran_id, val_id, status, value_a: orderId } = body;

    if (!tran_id || status !== 'VALID') {
      return { success: false, orderId: orderId ?? null };
    }

    // Find payment
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId: tran_id },
      include: { order: true },
    });

    if (!payment) return { success: false, orderId: orderId ?? null };

    // If IPN already processed this — just return orderId
    if (payment.paymentStatus === 'PAID') {
      return { success: true, orderId: payment.orderId };
    }

    // Re-verify (IPN may not have arrived yet)
    const isLive = this.config.get<string>('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
    const verifyEndpoint = isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX;

    try {
      const vRes = await axios.get(verifyEndpoint, {
        params: {
          val_id,
          store_id:     this.config.get('SSLCOMMERZ_STORE_ID',  'testbox'),
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
              note:      'পেমেন্ট সফল — অর্ডার নিশ্চিত',
              createdBy: 'PAYMENT_GATEWAY',
            },
          });
        });
        return { success: true, orderId: payment.orderId };
      }
    } catch (e: any) {
      this.logger.error(`Success verify failed: ${e.message}`);
    }

    return { success: false, orderId: payment.orderId };
  }

  // ── 4. FAIL CALLBACK ─────────────────────────────────
  async handlePaymentFailed(body: Record<string, any>) {
    const { tran_id, value_a: orderId } = body;
    if (tran_id) await this.markPaymentFailed(tran_id, 'পেমেন্ট ব্যর্থ হয়েছে');
    return { success: false, orderId: orderId ?? null };
  }

  // ── 5. CANCEL CALLBACK ────────────────────────────────
  async handlePaymentCancelled(body: Record<string, any>) {
    const { tran_id, value_a: orderId } = body;
    if (tran_id) await this.markPaymentCancelled(tran_id);
    return { success: false, orderId: orderId ?? null };
  }

  // ── 6. REFUND ─────────────────────────────────────────
  async initiateRefund(orderId: string, userId: string, reason: string, amount?: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, order: { userId } },
      include: { order: true },
    });

    if (!payment) throw new NotFoundException('পেমেন্ট তথ্য পাওয়া যায়নি');
    if (payment.paymentStatus !== 'PAID') {
      throw new BadRequestException('শুধুমাত্র পরিশোধিত অর্ডারে রিফান্ড করা যাবে');
    }

    const refundAmount = amount ?? Number(payment.amount);
    const isPartial = refundAmount < Number(payment.amount);

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
          note:      `রিফান্ড প্রক্রিয়া শুরু: ${reason}`,
          createdBy: 'SYSTEM',
        },
      });
    });

    return {
      success: true,
      message: 'রিফান্ড প্রক্রিয়া শুরু হয়েছে',
      refundAmount,
    };
  }

  // ── 7. GET PAYMENT STATUS ─────────────────────────────
  async getPaymentStatus(orderId: string, userId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId, order: { userId } },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!payment) throw new NotFoundException('পেমেন্ট তথ্য পাওয়া যায়নি');

    return {
      success: true,
      data: {
        ...payment,
        amount:       Number(payment.amount),
        refundAmount: payment.refundAmount ? Number(payment.refundAmount) : null,
        // NEVER expose sensitive fields — gatewayResponse stripped
        gatewayResponse: undefined,
      },
    };
  }

  // ── PRIVATE HELPERS ───────────────────────────────────

  private async rollbackPaymentStatus(orderId: string) {
    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY' },
    }).catch(() => {});
    await this.prisma.payment.updateMany({
      where: { orderId },
      data: { paymentStatus: 'FAILED' },
    }).catch(() => {});
  }

  private async markPaymentFailed(tranId: string, reason: string) {
    const payment = await this.prisma.payment.findFirst({ where: { transactionId: tranId } });
    if (!payment || ['PAID', 'FAILED'].includes(payment.paymentStatus)) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { paymentStatus: 'FAILED', failedAt: new Date(), failureReason: reason },
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
        data: { paymentStatus: 'CANCELLED' },
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
