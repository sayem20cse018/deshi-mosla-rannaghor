import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: { where: { isActive: true } },
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return { success: true, data: categories };
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        children: { where: { isActive: true } },
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    if (!category) throw new NotFoundException('ক্যাটাগরিটি পাওয়া যায়নি');
    return { success: true, data: category };
  }
}
