import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { success: true, message: 'Banners module - coming soon', data: [] };
  }
}
