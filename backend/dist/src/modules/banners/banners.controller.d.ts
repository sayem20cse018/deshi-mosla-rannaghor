import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: never[];
    }>;
}
