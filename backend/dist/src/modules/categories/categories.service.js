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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            where: { isActive: true, parentId: null },
            include: {
                children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
                _count: { select: { products: { where: { isActive: true } } } },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return { success: true, data: categories };
    }
    async findAllFlat() {
        const categories = await this.prisma.category.findMany({
            where: { isActive: true },
            select: {
                id: true, name: true, nameEn: true,
                slug: true, icon: true, parentId: true, sortOrder: true,
            },
            orderBy: { sortOrder: 'asc' },
        });
        return { success: true, data: categories };
    }
    async findForNav() {
        const categories = await this.prisma.category.findMany({
            where: { isActive: true, showInNav: true },
            select: {
                id: true,
                name: true,
                nameEn: true,
                slug: true,
                icon: true,
                navOrder: true,
                _count: { select: { products: { where: { isActive: true } } } },
            },
            orderBy: { navOrder: 'asc' },
        });
        return { success: true, data: categories };
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug, isActive: true },
            include: {
                parent: { select: { id: true, name: true, nameEn: true, slug: true } },
                children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
                _count: { select: { products: { where: { isActive: true } } } },
            },
        });
        if (!category)
            throw new common_1.NotFoundException('ক্যাটাগরিটি পাওয়া যায়নি');
        return { success: true, data: category };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map