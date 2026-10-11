import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export interface SSLCommerzConfig {
    storeId: string;
    storePass: string;
    isLive: boolean;
    backendUrl: string;
    frontendUrl: string;
    successUrl: string;
    failUrl: string;
    cancelUrl: string;
    ipnUrl: string;
    endpoint: string;
    verifyEndpoint: string;
    enabled: boolean;
    disabledReason: string | null;
}
export declare class PaymentConfigService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private _config;
    constructor(config: ConfigService);
    onModuleInit(): void;
    get(): SSLCommerzConfig;
    private buildConfig;
    private stripSlash;
}
