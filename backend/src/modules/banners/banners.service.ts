import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  // Public: active hero slides ordered by sortOrder
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

  // Public: homepage section config
  async getHomepageSections() {
    const sections = await this.prisma.homepageSection.findMany({
      where:   { isEnabled: true },
      orderBy: { sortOrder: 'asc' },
    });
    return { success: true, data: sections };
  }

  // Public: single section by key
  async getHomepageSection(key: string) {
    const section = await this.prisma.homepageSection.findUnique({ where: { key } });
    return { success: true, data: section ?? null };
  }

  // Legacy
  async findAll() {
    return this.getHeroSlides();
  }
}
