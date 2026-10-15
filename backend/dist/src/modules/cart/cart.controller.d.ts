import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCount(userId: string): Promise<{
        success: boolean;
        data: {
            count: number;
        };
    }>;
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
    updateItem(userId: string, productId: string, dto: UpdateCartItemDto): Promise<{
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
}
