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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_BYTES = 10 * 1024 * 1024;
let MediaService = class MediaService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        cloudinary_1.v2.config({
            cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.config.get('CLOUDINARY_API_KEY'),
            api_secret: this.config.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadFile(buffer, originalName, mimetype, folder = 'misc', uploadedBy) {
        if (buffer.length > MAX_BYTES)
            throw new common_1.BadRequestException('File too large. Max 10MB.');
        if (!ALLOWED_MIMES.includes(mimetype))
            throw new common_1.BadRequestException('Invalid file type.');
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'image', use_filename: true, unique_filename: true }, (err, res) => (err ? reject(err) : resolve(res)));
            stream_1.Readable.from(buffer).pipe(stream);
        });
        return this.prisma.mediaFile.create({
            data: {
                publicId: result.public_id,
                url: result.url,
                secureUrl: result.secure_url,
                originalName,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
                format: result.format,
                folder,
                resourceType: 'image',
                uploadedBy,
            },
        });
    }
    async uploadFiles(files, folder = 'misc', uploadedBy) {
        const results = await Promise.allSettled(files.map((f) => this.uploadFile(f.buffer, f.originalName, f.mimetype, folder, uploadedBy)));
        const succeeded = results
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value);
        const failed = results
            .filter((r) => r.status === 'rejected')
            .map((r) => r.reason?.message ?? 'Unknown error');
        return { succeeded, failed, total: files.length };
    }
    async getMedia(params) {
        const page = Math.max(1, params.page ?? 1);
        const limit = Math.min(100, params.limit ?? 24);
        const skip = (page - 1) * limit;
        const where = {};
        if (params.folder)
            where.folder = params.folder;
        if (params.format)
            where.format = params.format;
        if (params.search) {
            where.OR = [
                { originalName: { contains: params.search, mode: 'insensitive' } },
                { altText: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.mediaFile.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.mediaFile.count({ where }),
        ]);
        return {
            success: true,
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async getMediaById(id) {
        const m = await this.prisma.mediaFile.findUnique({ where: { id } });
        if (!m)
            throw new common_1.NotFoundException('Media not found');
        return { success: true, data: m };
    }
    async updateMedia(id, altText) {
        await this.getMediaById(id);
        const updated = await this.prisma.mediaFile.update({
            where: { id },
            data: { altText },
        });
        return { success: true, data: updated };
    }
    async deleteMedia(id) {
        const m = await this.prisma.mediaFile.findUnique({ where: { id } });
        if (!m)
            throw new common_1.NotFoundException('Media not found');
        try {
            await cloudinary_1.v2.uploader.destroy(m.publicId);
        }
        catch { }
        await this.prisma.mediaFile.delete({ where: { id } });
        return { success: true, message: 'Deleted' };
    }
    async bulkDelete(ids) {
        const files = await this.prisma.mediaFile.findMany({ where: { id: { in: ids } } });
        await Promise.allSettled(files.map((f) => cloudinary_1.v2.uploader.destroy(f.publicId)));
        await this.prisma.mediaFile.deleteMany({ where: { id: { in: ids } } });
        return { success: true, message: files.length + ' files deleted' };
    }
    async getSignedUploadUrl(folder = 'misc') {
        const timestamp = Math.round(Date.now() / 1000);
        const signature = cloudinary_1.v2.utils.api_sign_request({ timestamp, folder }, this.config.get('CLOUDINARY_API_SECRET') ?? '');
        return {
            success: true,
            data: {
                signature,
                timestamp,
                apiKey: this.config.get('CLOUDINARY_API_KEY'),
                cloudName: this.config.get('CLOUDINARY_CLOUD_NAME'),
                folder,
            },
        };
    }
    async getFolders() {
        const rows = await this.prisma.mediaFile.findMany({
            distinct: ['folder'],
            select: { folder: true },
            where: { folder: { not: null } },
        });
        return { success: true, data: rows.map((r) => r.folder) };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], MediaService);
//# sourceMappingURL=media.service.js.map