import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: never[];
    }>;
}
