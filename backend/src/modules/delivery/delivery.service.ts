import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { success: true, message: 'Delivery module - coming soon', data: [] };
  }
}
