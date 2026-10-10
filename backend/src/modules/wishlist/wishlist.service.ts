import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { success: true, message: 'Wishlist module - coming soon', data: [] };
  }
}
