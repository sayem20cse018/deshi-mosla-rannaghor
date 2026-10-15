import { Response } from 'express';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly config;
    constructor(paymentsService: PaymentsService, config: ConfigService);
    initiatePayment(userId: string, dto: InitiatePaymentDto): Promise<{
        success: boolean;
        gatewayUrl: any;
        transactionId: string;
        sessionKey: any;
        orderId: string;
        orderNumber: string;
        amount: number;
    }>;
    sslCommerzIPN(body: Record<string, any>): Promise<{
        received: boolean;
    }>;
    paymentSuccess(body: Record<string, any>, res: Response): Promise<void>;
    paymentFailed(body: Record<string, any>, res: Response): Promise<void>;
    paymentCancel(body: Record<string, any>, res: Response): Promise<void>;
    getPaymentStatus(userId: string, orderId: string): Promise<{
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
    requestRefund(userId: string, orderId: string, reason: string, amount?: number): Promise<{
        success: boolean;
        message: string;
        refundAmount: number;
    }>;
}
