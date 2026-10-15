import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: never[];
    }>;
}
