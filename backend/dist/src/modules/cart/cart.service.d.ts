import { PrismaService } from '../../common/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        success: boolean;
        data: {
            id: any;
            items: any;
            itemCount: number;
            subtotal: number;
            itemDiscount: number;
            deliveryCharge: number;
            isFreeDelivery: boolean;
            total: number;
            grandTotal: number;
        };
    }>;
    addItem(userId: string, dto: AddToCartDto): Promise<{
        success: boolean;
        message: string;
    }>;
    updateItem(userId: string, productId: string, quantity: number): Promise<{
        success: boolean;
        message: string;
    }>;
    removeItem(userId: string, productId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getItemCount(userId: string): Promise<{
        success: boolean;
        data: {
            count: number;
        };
    }>;
    private formatCart;
}
