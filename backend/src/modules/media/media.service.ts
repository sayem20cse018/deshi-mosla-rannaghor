import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_BYTES = 10 * 1024 * 1024;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key:    this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimetype: string,
    folder = 'misc',
    uploadedBy?: string,
  ) {
    if (buffer.length > MAX_BYTES) throw new BadRequestException('File too large. Max 10MB.');
    if (!ALLOWED_MIMES.includes(mimetype)) throw new BadRequestException('Invalid file type.');

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image', use_filename: true, unique_filename: true },
        (err, res) => (err ? reject(err) : resolve(res)),
      );
      Readable.from(buffer).pipe(stream);
    });

    return this.prisma.mediaFile.create({
      data: {
        publicId:     result.public_id,
        url:          result.url,
        secureUrl:    result.secure_url,
        originalName,
        width:        result.width,
        height:       result.height,
        bytes:        result.bytes,
        format:       result.format,
        folder,
        resourceType: 'image',
        uploadedBy,
      },
    });
  }

  async uploadFiles(
    files: { buffer: Buffer; originalName: string; mimetype: string }[],
    folder = 'misc',
    uploadedBy?: string,
  ) {
    const results = await Promise.allSettled(
      files.map((f) => this.uploadFile(f.buffer, f.originalName, f.mimetype, folder, uploadedBy)),
    );
    const succeeded = results
      .filter((r) => r.status === 'fulfilled')
      .map((r: any) => r.value);
    const failed = results
      .filter((r) => r.status === 'rejected')
      .map((r: any) => r.reason?.message ?? 'Unknown error');
    return { succeeded, failed, total: files.length };
  }

  async getMedia(params: {
    page?: number;
    limit?: number;
    search?: string;
    folder?: string;
    format?: string;
  }) {
    const page  = Math.max(1, params.page ?? 1);
    const limit = Math.min(100, params.limit ?? 24);
    const skip  = (page - 1) * limit;
    const where: any = {};
    if (params.folder) where.folder = params.folder;
    if (params.format) where.format = params.format;
    if (params.search) {
      where.OR = [
        { originalName: { contains: params.search, mode: 'insensitive' } },
        { altText:      { contains: params.search, mode: 'insensitive' } },
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

  async getMediaById(id: string) {
    const m = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Media not found');
    return { success: true, data: m };
  }

  async updateMedia(id: string, altText: string) {
    await this.getMediaById(id);
    const updated = await this.prisma.mediaFile.update({
      where: { id },
      data: { altText },
    });
    return { success: true, data: updated };
  }

  async deleteMedia(id: string) {
    const m = await this.prisma.mediaFile.findUnique({ where: { id } });
    if (!m) throw new NotFoundException('Media not found');
    try {
      await cloudinary.uploader.destroy(m.publicId);
    } catch {}
    await this.prisma.mediaFile.delete({ where: { id } });
    return { success: true, message: 'Deleted' };
  }

  async bulkDelete(ids: string[]) {
    const files = await this.prisma.mediaFile.findMany({ where: { id: { in: ids } } });
    await Promise.allSettled(files.map((f) => cloudinary.uploader.destroy(f.publicId)));
    await this.prisma.mediaFile.deleteMany({ where: { id: { in: ids } } });
    return { success: true, message: files.length + ' files deleted' };
  }

  async getSignedUploadUrl(folder = 'misc') {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      this.config.get('CLOUDINARY_API_SECRET') ?? '',
    );
    return {
      success: true,
      data: {
        signature,
        timestamp,
        apiKey:    this.config.get('CLOUDINARY_API_KEY'),
        cloudName: this.config.get('CLOUDINARY_CLOUD_NAME'),
        folder,
      },
    };
  }

  async getFolders() {
    const rows = await this.prisma.mediaFile.findMany({
      distinct:  ['folder'],
      select:    { folder: true },
      where:     { folder: { not: null } },
    });
    return { success: true, data: rows.map((r) => r.folder) };
  }
}
