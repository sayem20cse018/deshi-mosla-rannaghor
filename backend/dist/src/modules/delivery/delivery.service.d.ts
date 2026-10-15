import { PrismaService } from '../../common/prisma/prisma.service';
export declare class DeliveryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: never[];
    }>;
}
