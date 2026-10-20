import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ── Public endpoints ──────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'List products with filters, sort, pagination' })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('filter-meta')
  @ApiOperation({ summary: 'Get brands & price range for filter sidebar' })
  getFilterMeta(@Query('category') category?: string) {
    return this.productsService.getFilterMeta(category);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Featured products' })
  getFeatured(@Query('limit') limit?: number) {
    return this.productsService.getFeatured(limit);
  }

  @Public()
  @Get('best-sellers')
  @ApiOperation({ summary: 'Best selling products' })
  getBestSellers(@Query('limit') limit?: number) {
    return this.productsService.getBestSellers(limit);
  }

  @Public()
  @Get('new-arrivals')
  @ApiOperation({ summary: 'New arrival products' })
  getNewArrivals(@Query('limit') limit?: number) {
    return this.productsService.getNewArrivals(limit);
  }

  @Public()
  @Get(':slug/related')
  @ApiOperation({ summary: 'Related products by category' })
  getRelated(@Param('slug') slug: string, @Query('limit') limit?: number) {
    return this.productsService.getRelated(slug, limit);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get product detail by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  // ── Admin endpoints ───────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Post()
  @ApiOperation({ summary: '[Admin] Create product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Delete product' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Patch(':id/toggle/:flag')
  @ApiOperation({ summary: '[Admin] Toggle product flag (isFeatured, isBestSeller, etc.)' })
  toggleFlag(
    @Param('id') id: string,
    @Param('flag') flag: 'isFeatured' | 'isBestSeller' | 'isNewArrival' | 'isActive',
  ) {
    return this.productsService.toggleFlag(id, flag);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Get('admin/list')
  @ApiOperation({ summary: '[Admin] List all products including inactive' })
  adminFindAll(@Query() query: QueryProductDto) {
    return this.productsService.adminFindAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Post('admin/bulk-delete')
  @ApiOperation({ summary: '[Admin] Bulk delete products' })
  bulkDelete(@Body() body: { ids: string[] }) {
    return this.productsService.bulkDelete(body.ids);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Post('admin/bulk-status')
  @ApiOperation({ summary: '[Admin] Bulk update product status' })
  bulkStatus(@Body() body: { ids: string[]; isActive: boolean }) {
    return this.productsService.bulkStatus(body.ids, body.isActive);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Post(':id/images')
  @ApiOperation({ summary: '[Admin] Add product image' })
  addImage(
    @Param('id') id: string,
    @Body() body: { url: string; altText?: string; isPrimary?: boolean },
  ) {
    return this.productsService.addImage(id, body.url, body.altText, body.isPrimary);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Delete('images/:imageId')
  @ApiOperation({ summary: '[Admin] Delete product image' })
  deleteImage(@Param('imageId') imageId: string) {
    return this.productsService.deleteImage(imageId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Patch(':id/images/:imageId/primary')
  @ApiOperation({ summary: '[Admin] Set primary image' })
  setPrimaryImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.setPrimaryImage(id, imageId);
  }
}
