import { DeliveryService } from './delivery.service';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: never[];
    }>;
}
