import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  async findAll() {
    const collections = await this.prisma.collection.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        _count: { select: { products: true } },
      },
    });
    return { success: true, data: collections };
  }

  async findBySlug(slug: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { slug, isActive: true },
      include: {
        products: {
          orderBy: { sortOrder: 'asc' },
          include: {
            product: {
              include: {
                category: { select: { id: true, name: true, slug: true } },
                brand:    { select: { id: true, name: true } },
                images:   { where: { isPrimary: true }, select: { url: true }, take: 1 },
                inventory: { select: { availableStock: true } },
              },
            },
          },
        },
      },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return {
      success: true,
      data: {
        ...collection,
        products: collection.products.map((cp) => ({
          ...cp.product,
          price:          Number(cp.product.price),
          discountPrice:  cp.product.discountPrice ? Number(cp.product.discountPrice) : null,
          primaryImage:   cp.product.images[0]?.url ?? null,
          availableStock: cp.product.inventory?.availableStock ?? 0,
          sortOrder:      cp.sortOrder,
          images:         undefined,
          inventory:      undefined,
        })),
      },
    };
  }

  // ---------------------------------------------------------------------------
  // ADMIN
  // ---------------------------------------------------------------------------

  async adminFindAll(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name:  { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { slug:  { contains: search, mode: 'insensitive' } },
      ];
    }

    const [collections, total] = await Promise.all([
      this.prisma.collection.findMany({
        where: where as any,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: { _count: { select: { products: true } } },
      }),
      this.prisma.collection.count({ where: where as any }),
    ]);

    return {
      success: true,
      data: collections,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async adminFindOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { sortOrder: 'asc' },
          include: {
            product: {
              select: {
                id: true, name: true, slug: true, sku: true,
                price: true, discountPrice: true, stockStatus: true,
                images: { where: { isPrimary: true }, select: { url: true }, take: 1 },
              },
            },
          },
        },
        _count: { select: { products: true } },
      },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return {
      success: true,
      data: {
        ...collection,
        products: collection.products.map((cp) => ({
          ...cp.product,
          price:         Number(cp.product.price),
          discountPrice: cp.product.discountPrice ? Number(cp.product.discountPrice) : null,
          primaryImage:  (cp.product.images as Array<{url:string}>)[0]?.url ?? null,
          sortOrder:     cp.sortOrder,
          collectionProductId: cp.id,
          images:        undefined,
        })),
      },
    };
  }

  async adminCreate(dto: CreateCollectionDto) {
    const collection = await this.prisma.collection.create({
      data: {
        name:        dto.name,
        nameEn:      dto.nameEn,
        slug:        dto.slug,
        description: dto.description,
        image:       dto.image,
        banner:      dto.banner,
        isActive:    dto.isActive ?? true,
        sortOrder:   dto.sortOrder ?? 0,
        metaTitle:   dto.metaTitle,
        metaDesc:    dto.metaDesc,
      },
    });
    return { success: true, message: 'Collection created', data: collection };
  }

  async adminUpdate(id: string, dto: UpdateCollectionDto) {
    const existing = await this.prisma.collection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Collection not found');

    const collection = await this.prisma.collection.update({
      where: { id },
      data: dto as any,
    });
    return { success: true, message: 'Collection updated', data: collection };
  }

  async adminDelete(id: string) {
    const existing = await this.prisma.collection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Collection not found');
    await this.prisma.collection.delete({ where: { id } });
    return { success: true, message: 'Collection deleted' };
  }

  async adminAddProduct(collectionId: string, productId: string, sortOrder = 0) {
    const existing = await this.prisma.collectionProduct.findUnique({
      where: { collectionId_productId: { collectionId, productId } },
    });
    if (existing) return { success: true, message: 'Product already in collection' };

    await this.prisma.collectionProduct.create({
      data: { collectionId, productId, sortOrder },
    });
    return { success: true, message: 'Product added to collection' };
  }

  async adminRemoveProduct(collectionId: string, productId: string) {
    await this.prisma.collectionProduct.deleteMany({
      where: { collectionId, productId },
    });
    return { success: true, message: 'Product removed from collection' };
  }
}
