"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const DEFAULTS = {
    'store.name': { value: 'দেশি মসলার রান্নাঘর', description: 'Store name (Bengali)', group: 'store' },
    'store.name_en': { value: 'Deshi Moslar Rannaghar', description: 'Store name (English)', group: 'store' },
    'store.email': { value: 'info@deshimoslar.com', description: 'Store contact email', group: 'store' },
    'store.phone': { value: '+880 1700-000000', description: 'Store contact phone', group: 'store' },
    'store.address': { value: 'Dhaka, Bangladesh', description: 'Store address', group: 'store' },
    'store.currency': { value: 'BDT', description: 'Currency code', group: 'store' },
    'store.currency_symbol': { value: '৳', description: 'Currency symbol', group: 'store' },
    'store.whatsapp': { value: '+880 1700-000000', description: 'WhatsApp support number', group: 'store' },
    'seo.meta_title': { value: 'দেশি মসলার রান্নাঘর | Deshi Moslar Rannaghar', description: 'Default SEO title', group: 'seo' },
    'seo.meta_desc': { value: 'বাংলাদেশের বিশ্বস্ত অনলাইন মসলা ও গ্রোসারি শপ।', description: 'Default meta description', group: 'seo' },
    'seo.keywords': { value: 'মসলা, grocery, online shop, Bangladesh', description: 'SEO keywords', group: 'seo' },
    'tax.rate': { value: '0', description: 'Tax rate (%)', group: 'tax' },
    'tax.enabled': { value: 'false', description: 'Enable tax calculation', group: 'tax' },
    'delivery.free_threshold': { value: '1000', description: 'Free delivery above this amount (৳)', group: 'delivery' },
    'delivery.default_charge': { value: '60', description: 'Default delivery charge (৳)', group: 'delivery' },
    'payment.cod_enabled': { value: 'true', description: 'Enable Cash on Delivery', group: 'payment' },
    'payment.ssl_enabled': { value: 'true', description: 'Enable SSLCommerz payments', group: 'payment' },
};
let SettingsService = class SettingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(group) {
        for (const [key, def] of Object.entries(DEFAULTS)) {
            await this.prisma.siteSettings.upsert({
                where: { key },
                create: { key, value: def.value, description: def.description, group: def.group },
                update: {},
            });
        }
        const settings = await this.prisma.siteSettings.findMany({
            where: group ? { group } : undefined,
            orderBy: [{ group: 'asc' }, { key: 'asc' }],
        });
        const grouped = {};
        for (const s of settings) {
            const g = s.group ?? 'general';
            if (!grouped[g])
                grouped[g] = {};
            grouped[g][s.key.split('.')[1] ?? s.key] = s.value;
        }
        return { success: true, data: { settings, grouped } };
    }
    async get(key) {
        const setting = await this.prisma.siteSettings.findUnique({ where: { key } });
        return { success: true, data: setting };
    }
    async set(key, value) {
        const def = DEFAULTS[key];
        const result = await this.prisma.siteSettings.upsert({
            where: { key },
            create: { key, value, description: def?.description, group: def?.group },
            update: { value },
        });
        return { success: true, data: result };
    }
    async setBulk(items) {
        const results = await Promise.all(items.map(({ key, value }) => this.set(key, value)));
        return { success: true, data: results.map(r => r.data), message: `${items.length} settings saved.` };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map