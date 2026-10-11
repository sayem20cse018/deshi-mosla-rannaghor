"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = exports.GUEST_SENTINEL = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const payment_config_service_1 = require("./payment-config.service");
const GUEST_SENTINEL = '__GUEST__';
exports.GUEST_SENTINEL = GUEST_SENTINEL;
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, paymentConfig) {
        this.prisma = prisma;
        this.paymentConfig = paymentConfig;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async initiateSSLCommerzPayment(userId, dto) {
        const isGuest = userId === GUEST_SENTINEL;
        const order = await this.prisma.order.findFirst({
            where: isGuest
                ? { id: dto.orderId, userId: null }
                : { id: dto.orderId, userId },
            include: { address: true, payment: true, user: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(isGuest
                ? 'Guest order not found.'
                : 'Order not found or does not belong to you.');
        }
        if (order.paymentStatus === 'PAID') {
            throw new common_1.BadRequestException('This order has already been paid.');
        }
        if (order.paymentStatus === 'PROCESSING') {
            throw new common_1.BadRequestException('Payment is already in progress for this order.');
        }
        const cfg = this.paymentConfig.get();
        if (!cfg.enabled) {
            throw new common_1.BadRequestException('Online payment is currently unavailable: ' + (cfg.disabledReason ?? 'configuration error'));
        }
        const customerName = dto.customerName ?? order.user?.name ?? order.address.fullName;
        const customerEmail = dto.customerEmail ?? order.user?.email ?? 'guest@deshimoslar.com';
        const customerPhone = dto.customerPhone ?? order.user?.phone ?? order.address.phone;
        const customerAddress = dto.customerAddress ?? order.address.fullAddress;
        const tran_id = `DMR-${order.orderNumber}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        this.logger.log(`SSLCommerz initiate: orderId=${order.id} mode=${cfg.isLive ? 'LIVE' : 'SANDBOX'} ` +
            `ipnUrl=${cfg.ipnUrl}`);
        const params = new URLSearchParams({
            store_id: cfg.storeId,
            store_passwd: cfg.storePass,
            total_amount: Number(order.totalAmount).toFixed(2),
            currency: 'BDT',
            tran_id,
            success_url: cfg.successUrl,
            fail_url: cfg.failUrl,
            cancel_url: cfg.cancelUrl,
            ipn_url: cfg.ipnUrl,
            cus_name: customerName,
            cus_email: customerEmail,
            cus_add1: customerAddress,
            cus_city: order.address.district,
            cus_state: order.address.division,
            cus_postcode: order.address.postalCode ?? '1000',
            cus_country: 'Bangladesh',
            cus_phone: customerPhone,
            ship_name: customerName,
            ship_add1: customerAddress,
            ship_city: order.address.district,
            ship_state: order.address.division,
            ship_postcode: order.address.postalCode ?? '1000',
            ship_country: 'Bangladesh',
            product_name: `Deshi Moslar Rannaghar Order #${order.orderNumber}`,
            product_category: 'Grocery',
            product_profile: 'general',
            value_a: order.id,
            value_b: isGuest ? 'guest' : userId,
            value_c: order.orderNumber,
            value_d: isGuest ? 'guest' : 'auth',
        });
        await this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: order.id },
                data: { paymentStatus: 'PROCESSING', paymentMethod: dto.paymentMethod },
            });
            let paymentId;
            if (order.payment) {
                await tx.payment.update({
                    where: { id: order.payment.id },
                    data: {
                        transactionId: tran_id,
                        paymentMethod: dto.paymentMethod,
                        paymentStatus: 'PROCESSING',
                        paymentRef: tran_id,
                    },
                });
                paymentId = order.payment.id;
            }
            else {
                const newPayment = await tx.payment.create({
                    data: {
                        orderId: order.id,
                        transactionId: tran_id,
                        amount: order.totalAmount,
                        paymentMethod: dto.paymentMethod,
                        paymentStatus: 'PROCESSING',
                        paymentRef: tran_id,
                    },
                });
                paymentId = newPayment.id;
            }
            await tx.paymentTransaction.create({
                data: {
                    paymentId,
                    txnId: tran_id,
                    amount: order.totalAmount,
                    status: 'INITIATED',
                    method: dto.paymentMethod,
                    gateway: 'SSLCOMMERZ',
                },
            });
        });
        try {
            const response = await axios_1.default.post(cfg.endpoint, params.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000,
            });
            const sslData = response.data;
            if (sslData?.status === 'SUCCESS' && sslData?.GatewayPageURL) {
                this.logger.log(`SSLCommerz session created: tran_id=${tran_id}, order=${order.orderNumber}`);
                return {
                    success: true,
                    gatewayUrl: sslData.GatewayPageURL,
                    transactionId: tran_id,
                    sessionKey: sslData.sessionkey,
                    orderId: order.id,
                    orderNumber: order.orderNumber,
                    amount: Number(order.totalAmount),
                };
            }
            await this.rollbackPaymentStatus(order.id);
            throw new common_1.BadRequestException(`Payment gateway error: ${sslData?.failedreason ?? 'Unknown error'}`);
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException)
                throw err;
            await this.rollbackPaymentStatus(order.id);
            this.logger.error(`SSLCommerz init failed: ${err.message}`);
            throw new common_1.BadRequestException('Could not connect to payment gateway. Please try again.');
        }
    }
    async handleSSLCommerzIPN(body) {
        const { tran_id, val_id, status, value_a: orderId } = body;
        this.logger.log(`IPN: tran_id=${tran_id}, status=${status}, orderId=${orderId}`);
        if (!tran_id || !orderId) {
            this.logger.warn('IPN missing tran_id or orderId — ignored');
            return { received: true };
        }
        const payment = await this.prisma.payment.findFirst({
            where: { transactionId: tran_id },
            include: { order: true },
        });
        if (!payment) {
            this.logger.warn(`IPN: no payment found for tran_id=${tran_id}`);
            return { received: true };
        }
        if (['PAID', 'FAILED', 'CANCELLED'].includes(payment.paymentStatus)) {
            this.logger.log(`IPN: already finalized (${payment.paymentStatus}) — skipped`);
            return { received: true };
        }
        const cfg = this.paymentConfig.get();
        let verified = false;
        let rawVerification = null;
        if (status === 'VALID' || status === 'VALIDATED') {
            try {
                const vRes = await axios_1.default.get(cfg.verifyEndpoint, {
                    params: {
                        val_id,
                        store_id: cfg.storeId,
                        store_passwd: cfg.storePass,
                        format: 'json',
                    },
                    timeout: 10000,
                });
                rawVerification = vRes.data;
                verified = vRes.data?.status === 'VALID' || vRes.data?.status === 'VALIDATED';
                this.logger.log(`IPN verify: ${vRes.data?.status}`);
            }
            catch (e) {
                this.logger.error(`IPN verify failed: ${e.message}`);
            }
        }
        const txnStatus = verified ? 'SUCCESS' : (status === 'FAILED' ? 'FAILED' : 'CANCELLED');
        const payStatus = verified ? 'PAID' : (status === 'FAILED' ? 'FAILED' : 'CANCELLED');
        const ordStatus = verified ? 'CONFIRMED' : 'PENDING';
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    paymentStatus: payStatus,
                    gatewayTxnId: val_id ?? tran_id,
                    gatewayResponse: rawVerification ?? body,
                    verifiedAt: verified ? new Date() : undefined,
                    paidAt: verified ? new Date() : undefined,
                    failedAt: !verified ? new Date() : undefined,
                    failureReason: !verified ? `IPN status: ${status}` : undefined,
                },
            });
            await tx.order.update({
                where: { id: payment.orderId },
                data: {
                    paymentStatus: payStatus,
                    status: ordStatus,
                    confirmedAt: verified ? new Date() : undefined,
                },
            });
            await tx.paymentTransaction.create({
                data: {
                    paymentId: payment.id,
                    txnId: tran_id,
                    amount: payment.amount,
                    status: txnStatus,
                    method: payment.paymentMethod,
                    gateway: 'SSLCOMMERZ',
                    rawResponse: body,
                    ipnData: rawVerification ?? body,
                },
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId: payment.orderId,
                    status: ordStatus,
                    note: verified
                        ? 'SSLCommerz payment verified via IPN'
                        : `Payment failed via IPN: ${status}`,
                    createdBy: 'PAYMENT_GATEWAY',
                },
            });
        });
        return { received: true };
    }
    async handlePaymentSuccess(body) {
        const { tran_id, val_id, status, value_a: orderId } = body;
        if (!tran_id || status !== 'VALID') {
            return { success: false, orderId: orderId ?? null };
        }
        const payment = await this.prisma.payment.findFirst({
            where: { transactionId: tran_id },
            include: { order: true },
        });
        if (!payment)
            return { success: false, orderId: orderId ?? null };
        if (payment.paymentStatus === 'PAID') {
            return { success: true, orderId: payment.orderId };
        }
        const cfg = this.paymentConfig.get();
        try {
            const vRes = await axios_1.default.get(cfg.verifyEndpoint, {
                params: {
                    val_id,
                    store_id: cfg.storeId,
                    store_passwd: cfg.storePass,
                    format: 'json',
                },
                timeout: 10000,
            });
            if (vRes.data?.status === 'VALID' || vRes.data?.status === 'VALIDATED') {
                await this.prisma.$transaction(async (tx) => {
                    await tx.payment.update({
                        where: { id: payment.id },
                        data: {
                            paymentStatus: 'PAID',
                            gatewayTxnId: val_id,
                            gatewayResponse: vRes.data,
                            verifiedAt: new Date(),
                            paidAt: new Date(),
                        },
                    });
                    await tx.order.update({
                        where: { id: payment.orderId },
                        data: { paymentStatus: 'PAID', status: 'CONFIRMED', confirmedAt: new Date() },
                    });
                    await tx.paymentTransaction.create({
                        data: {
                            paymentId: payment.id,
                            txnId: tran_id,
                            amount: payment.amount,
                            status: 'SUCCESS',
                            method: payment.paymentMethod,
                            gateway: 'SSLCOMMERZ',
                            rawResponse: vRes.data,
                        },
                    });
                    await tx.orderStatusHistory.create({
                        data: {
                            orderId: payment.orderId,
                            status: 'CONFIRMED',
                            note: 'Payment successful — order confirmed',
                            createdBy: 'PAYMENT_GATEWAY',
                        },
                    });
                });
                return { success: true, orderId: payment.orderId };
            }
        }
        catch (e) {
            this.logger.error(`Success callback verify failed: ${e.message}`);
        }
        return { success: false, orderId: payment.orderId };
    }
    async handlePaymentFailed(body) {
        const { tran_id, value_a: orderId } = body;
        if (tran_id)
            await this.markPaymentFailed(tran_id, 'Payment failed at gateway');
        return { success: false, orderId: orderId ?? null };
    }
    async handlePaymentCancelled(body) {
        const { tran_id, value_a: orderId } = body;
        if (tran_id)
            await this.markPaymentCancelled(tran_id);
        return { success: false, orderId: orderId ?? null };
    }
    async initiateRefund(orderId, userId, reason, amount) {
        const payment = await this.prisma.payment.findFirst({
            where: { orderId, order: { userId } },
            include: { order: true },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found.');
        if (payment.paymentStatus !== 'PAID') {
            throw new common_1.BadRequestException('Refunds are only allowed for paid orders.');
        }
        const refundAmount = amount ?? Number(payment.amount);
        const isPartial = refundAmount < Number(payment.amount);
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    paymentStatus: isPartial ? 'PARTIALLY_REFUNDED' : 'REFUNDED',
                    refundedAt: new Date(),
                    refundAmount,
                    refundReason: reason,
                    refundTxnId: `REF-${payment.transactionId}-${Date.now()}`,
                },
            });
            await tx.order.update({
                where: { id: orderId },
                data: {
                    paymentStatus: isPartial ? 'PARTIALLY_REFUNDED' : 'REFUNDED',
                    status: 'REFUNDED',
                },
            });
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    status: 'REFUNDED',
                    note: `Refund initiated: ${reason}`,
                    createdBy: 'SYSTEM',
                },
            });
        });
        return { success: true, message: 'Refund process started.', refundAmount };
    }
    async getPaymentStatus(orderId, userId) {
        const payment = await this.prisma.payment.findFirst({
            where: { orderId, order: { userId } },
            include: { transactions: { orderBy: { createdAt: 'desc' }, take: 5 } },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found.');
        return {
            success: true,
            data: {
                ...payment,
                amount: Number(payment.amount),
                refundAmount: payment.refundAmount ? Number(payment.refundAmount) : null,
                gatewayResponse: undefined,
            },
        };
    }
    async rollbackPaymentStatus(orderId) {
        await this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY' },
        }).catch(() => { });
        await this.prisma.payment.updateMany({
            where: { orderId },
            data: { paymentStatus: 'FAILED' },
        }).catch(() => { });
    }
    async markPaymentFailed(tranId, reason) {
        const payment = await this.prisma.payment.findFirst({ where: { transactionId: tranId } });
        if (!payment || ['PAID', 'FAILED'].includes(payment.paymentStatus))
            return;
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: { paymentStatus: 'FAILED', failedAt: new Date(), failureReason: reason },
            });
            await tx.order.update({
                where: { id: payment.orderId },
                data: { paymentStatus: 'FAILED' },
            });
            await tx.paymentTransaction.create({
                data: {
                    paymentId: payment.id,
                    txnId: tranId,
                    amount: payment.amount,
                    status: 'FAILED',
                    method: payment.paymentMethod,
                    gateway: 'SSLCOMMERZ',
                },
            });
        });
    }
    async markPaymentCancelled(tranId) {
        const payment = await this.prisma.payment.findFirst({ where: { transactionId: tranId } });
        if (!payment || ['PAID', 'CANCELLED'].includes(payment.paymentStatus))
            return;
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: payment.id },
                data: { paymentStatus: 'CANCELLED' },
            });
            await tx.order.update({
                where: { id: payment.orderId },
                data: { paymentStatus: 'CANCELLED' },
            });
            await tx.paymentTransaction.create({
                data: {
                    paymentId: payment.id,
                    txnId: tranId,
                    amount: payment.amount,
                    status: 'CANCELLED',
                    method: payment.paymentMethod,
                    gateway: 'SSLCOMMERZ',
                },
            });
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payment_config_service_1.PaymentConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map