import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
export declare class PaymentsService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    initiateSSLCommerzPayment(userId: string, dto: InitiatePaymentDto): Promise<{
        success: boolean;
        gatewayUrl: any;
        transactionId: string;
        sessionKey: any;
        orderId: string;
        orderNumber: string;
        amount: number;
    }>;
    handleSSLCommerzIPN(body: Record<string, any>): Promise<{
        received: boolean;
    }>;
    handlePaymentSuccess(body: Record<string, any>): Promise<{
        success: boolean;
        orderId: any;
    }>;
    handlePaymentFailed(body: Record<string, any>): Promise<{
        success: boolean;
        orderId: any;
    }>;
    handlePaymentCancelled(body: Record<string, any>): Promise<{
        success: boolean;
        orderId: any;
    }>;
    initiateRefund(orderId: string, userId: string, reason: string, amount?: number): Promise<{
        success: boolean;
        message: string;
        refundAmount: number;
    }>;
    getPaymentStatus(orderId: string, userId: string): Promise<{
        success: boolean;
        data: {
            amount: number;
            refundAmount: number | null;
            gatewayResponse: undefined;
            transactions: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.TransactionStatus;
                amount: import("@prisma/client/runtime/library").Decimal;
                paymentId: string;
                txnId: string;
                method: import(".prisma/client").$Enums.PaymentMethod;
                gateway: string | null;
                rawResponse: import("@prisma/client/runtime/library").JsonValue | null;
                ipnData: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
            id: string;
            createdAt: Date;
            updatedAt: Date;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            transactionId: string | null;
            gatewayTxnId: string | null;
            codStatus: import(".prisma/client").$Enums.CodStatus | null;
            bankName: string | null;
            accountNumber: string | null;
            paymentRef: string | null;
            verifiedAt: Date | null;
            paidAt: Date | null;
            failedAt: Date | null;
            failureReason: string | null;
            refundedAt: Date | null;
            refundReason: string | null;
            refundTxnId: string | null;
        };
    }>;
    private rollbackPaymentStatus;
    private markPaymentFailed;
    private markPaymentCancelled;
}
