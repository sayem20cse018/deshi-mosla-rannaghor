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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let BannersService = class BannersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHeroSlides() {
        const now = new Date();
        const slides = await this.prisma.heroSlide.findMany({
            where: {
                isActive: true,
                OR: [
                    { startDate: null },
                    { startDate: { lte: now } },
                ],
                AND: [
                    { OR: [{ endDate: null }, { endDate: { gte: now } }] },
                ],
            },
            orderBy: { sortOrder: 'asc' },
        });
        return { success: true, data: slides };
    }
    async getHomepageSections() {
        const sections = await this.prisma.homepageSection.findMany({
            where: { isEnabled: true },
            orderBy: { sortOrder: 'asc' },
        });
        return { success: true, data: sections };
    }
    async getHomepageSection(key) {
        const section = await this.prisma.homepageSection.findUnique({ where: { key } });
        return { success: true, data: section ?? null };
    }
    async findAll() {
        return this.getHeroSlides();
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BannersService);
//# sourceMappingURL=banners.service.js.map