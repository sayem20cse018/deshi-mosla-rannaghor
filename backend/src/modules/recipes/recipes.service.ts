import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return { success: true, message: 'Recipes module - coming soon', data: [] };
  }
}
