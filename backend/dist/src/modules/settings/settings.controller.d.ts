import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAll(group?: string): Promise<{
        success: boolean;
        data: {
            settings: {
                description: string | null;
                id: string;
                updatedAt: Date;
                key: string;
                value: string;
                group: string | null;
            }[];
            grouped: Record<string, Record<string, string>>;
        };
    }>;
    setBulk(body: {
        settings: {
            key: string;
            value: string;
        }[];
    }): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            updatedAt: Date;
            key: string;
            value: string;
            group: string | null;
        }[];
        message: string;
    }>;
}
