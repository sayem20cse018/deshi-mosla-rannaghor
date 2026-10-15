import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private readonly configService;
    constructor(configService: ConfigService);
    getHealth(): {
        status: string;
        name: string;
        version: string;
        environment: any;
        timestamp: string;
    };
}
