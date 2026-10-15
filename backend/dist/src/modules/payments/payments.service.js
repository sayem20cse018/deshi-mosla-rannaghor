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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const SSL_SANDBOX = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSL_LIVE = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSL_VERIFY_SANDBOX = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
const SSL_VERIFY_LIVE = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async initiateSSLCommerzPayment(userId, dto) {
        const order = await this.prisma.order.findFirst({
            where: { id: dto.orderId, userId },
            include: { address: true, payment: true, user: true },
        });
        if (!order)
            throw new common_1.NotFoundException('অর্ডারটি পাওয়া যায়নি');
        if (order.paymentStatus === 'PAID') {
            throw new common_1.BadRequestException('এই অর্ডারটি ইতিমধ্যে পরিশোধ করা হয়েছে');
        }
        if (order.paymentStatus === 'PROCESSING') {
            throw new common_1.BadRequestException('পেমেন্ট ইতিমধ্যে প্রক্রিয়াধীন আছে');
        }
        const tran_id = `DMR-${order.orderNumber}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
        const storeId = this.config.get('SSLCOMMERZ_STORE_ID', 'testbox');
        const storePass = this.config.get('SSLCOMMERZ_STORE_PASSWORD', 'qwerty');
        const isLive = this.config.get('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
        const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        const backendUrl = `http://localhost:${this.config.get('PORT', '5000')}/api/v1`;
        const successUrl = this.config.get('SSLCOMMERZ_SUCCESS_URL', `${frontendUrl}/payment/success`);
        const failUrl = this.config.get('SSLCOMMERZ_FAIL_URL', `${frontendUrl}/payment/failed`);
        const cancelUrl = this.config.get('SSLCOMMERZ_CANCEL_URL', `${frontendUrl}/payment/cancel`);
        const ipnUrl = this.config.get('SSLCOMMERZ_WEBHOOK_URL', `${backendUrl}/payments/webhook/sslcommerz`);
        const customerName = dto.customerName ?? order.user?.name ?? order.address.fullName;
        const customerEmail = dto.customerEmail ?? order.user?.email ?? 'customer@deshimoslar.com';
        const customerPhone = dto.customerPhone ?? order.user?.phone ?? order.address.phone;
        const customerAddress = dto.customerAddress ?? order.address.fullAddress;
        const params = new URLSearchParams({
            store_id: storeId,
            store_passwd: storePass,
            total_amount: Number(order.totalAmount).toFixed(2),
            currency: 'BDT',
            tran_id,
            success_url: successUrl,
            fail_url: failUrl,
            cancel_url: cancelUrl,
            ipn_url: ipnUrl,
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
            value_b: userId,
            value_c: order.orderNumber,
            value_d: '',
        });
        await this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: order.id },
                data: { paymentStatus: 'PROCESSING', paymentMethod: dto.paymentMethod },
            });
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
            }
            else {
                await tx.payment.create({
                    data: {
                        orderId: order.id,
                        transactionId: tran_id,
                        amount: order.totalAmount,
                        paymentMethod: dto.paymentMethod,
                        paymentStatus: 'PROCESSING',
                        paymentRef: tran_id,
                    },
                });
            }
            await tx.paymentTransaction.create({
                data: {
                    paymentId: (order.payment?.id ?? (await tx.payment.findUnique({ where: { orderId: order.id } })).id),
                    txnId: tran_id,
                    amount: order.totalAmount,
                    status: 'INITIATED',
                    method: dto.paymentMethod,
                    gateway: 'SSLCOMMERZ',
                },
            });
        });
        const endpoint = isLive ? SSL_LIVE : SSL_SANDBOX;
        try {
            const response = await axios_1.default.post(endpoint, params.toString(), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000,
            });
            const sslData = response.data;
            if (sslData?.status === 'SUCCESS' && sslData?.GatewayPageURL) {
                this.logger.log(`SSLCommerz initiated: tran_id=${tran_id}, order=${order.orderNumber}`);
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
            throw new common_1.BadRequestException(`পেমেন্ট গেটওয়ে সংযোগ ব্যর্থ হয়েছে: ${sslData?.failedreason ?? 'Unknown error'}`);
        }
        catch (err) {
            if (err instanceof common_1.BadRequestException)
                throw err;
            await this.rollbackPaymentStatus(order.id);
            this.logger.error(`SSLCommerz init failed: ${err.message}`);
            throw new common_1.BadRequestException('পেমেন্ট গেটওয়ের সাথে সংযোগ করা যাচ্ছে না। পরে চেষ্টা করুন।');
        }
    }
    async handleSSLCommerzIPN(body) {
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
        if (['PAID', 'FAILED', 'CANCELLED'].includes(payment.paymentStatus)) {
            this.logger.log(`IPN: already finalized (${payment.paymentStatus}), skipping`);
            return { received: true };
        }
        const isLive = this.config.get('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
        const verifyEndpoint = isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX;
        const storeId = this.config.get('SSLCOMMERZ_STORE_ID', 'testbox');
        const storePass = this.config.get('SSLCOMMERZ_STORE_PASSWORD', 'qwerty');
        let verified = false;
        let rawVerification = null;
        if (status === 'VALID' || status === 'VALIDATED') {
            try {
                const vRes = await axios_1.default.get(verifyEndpoint, {
                    params: {
                        val_id,
                        store_id: storeId,
                        store_passwd: storePass,
                        format: 'json',
                    },
                    timeout: 10000,
                });
                rawVerification = vRes.data;
                verified = vRes.data?.status === 'VALID' || vRes.data?.status === 'VALIDATED';
                this.logger.log(`SSL verify: ${vRes.data?.status}`);
            }
            catch (e) {
                this.logger.error(`SSL verification failed: ${e.message}`);
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
                    note: verified ? 'SSLCommerz পেমেন্ট যাচাই সম্পন্ন' : `পেমেন্ট ব্যর্থ: ${status}`,
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
        const isLive = this.config.get('SSLCOMMERZ_IS_LIVE', 'false') === 'true';
        const verifyEndpoint = isLive ? SSL_VERIFY_LIVE : SSL_VERIFY_SANDBOX;
        try {
            const vRes = await axios_1.default.get(verifyEndpoint, {
                params: {
                    val_id,
                    store_id: this.config.get('SSLCOMMERZ_STORE_ID', 'testbox'),
                    store_passwd: this.config.get('SSLCOMMERZ_STORE_PASSWORD', 'qwerty'),
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
                            note: 'পেমেন্ট সফল — অর্ডার নিশ্চিত',
                            createdBy: 'PAYMENT_GATEWAY',
                        },
                    });
                });
                return { success: true, orderId: payment.orderId };
            }
        }
        catch (e) {
            this.logger.error(`Success verify failed: ${e.message}`);
        }
        return { success: false, orderId: payment.orderId };
    }
    async handlePaymentFailed(body) {
        const { tran_id, value_a: orderId } = body;
        if (tran_id)
            await this.markPaymentFailed(tran_id, 'পেমেন্ট ব্যর্থ হয়েছে');
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
            throw new common_1.NotFoundException('পেমেন্ট তথ্য পাওয়া যায়নি');
        if (payment.paymentStatus !== 'PAID') {
            throw new common_1.BadRequestException('শুধুমাত্র পরিশোধিত অর্ডারে রিফান্ড করা যাবে');
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
                    note: `রিফান্ড প্রক্রিয়া শুরু: ${reason}`,
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
    async getPaymentStatus(orderId, userId) {
        const payment = await this.prisma.payment.findFirst({
            where: { orderId, order: { userId } },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException('পেমেন্ট তথ্য পাওয়া যায়নি');
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
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map