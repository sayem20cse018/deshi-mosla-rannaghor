import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    findAll(): Promise<{
        success: boolean;
        message: string;
        data: never[];
    }>;
}
