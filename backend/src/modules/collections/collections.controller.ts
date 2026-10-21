import {
  Controller, Get, Post, Patch, Delete,
  Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/create-collection.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  @Public()
  @Get()
  @ApiOperation({ summary: 'All active collections' })
  findAll() {
    return this.collectionsService.findAll();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Collection by slug with products' })
  findBySlug(@Param('slug') slug: string) {
    return this.collectionsService.findBySlug(slug);
  }

  // ---------------------------------------------------------------------------
  // ADMIN
  // ---------------------------------------------------------------------------

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Get('admin/list')
  @ApiOperation({ summary: '[Admin] List all collections' })
  @ApiQuery({ name: 'page',   required: false })
  @ApiQuery({ name: 'limit',  required: false })
  @ApiQuery({ name: 'search', required: false })
  adminFindAll(
    @Query('page')   page?:   string,
    @Query('limit')  limit?:  string,
    @Query('search') search?: string,
  ) {
    return this.collectionsService.adminFindAll({
      page:  page  ? Number(page)  : 1,
      limit: limit ? Number(limit) : 20,
      search,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Get('admin/:id')
  @ApiOperation({ summary: '[Admin] Get collection by id' })
  adminFindOne(@Param('id') id: string) {
    return this.collectionsService.adminFindOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Post('admin')
  @ApiOperation({ summary: '[Admin] Create collection' })
  adminCreate(@Body() dto: CreateCollectionDto) {
    return this.collectionsService.adminCreate(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Patch('admin/:id')
  @ApiOperation({ summary: '[Admin] Update collection' })
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateCollectionDto) {
    return this.collectionsService.adminUpdate(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Delete('admin/:id')
  @ApiOperation({ summary: '[Admin] Delete collection' })
  adminDelete(@Param('id') id: string) {
    return this.collectionsService.adminDelete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Post('admin/:id/products')
  @ApiOperation({ summary: '[Admin] Add product to collection' })
  adminAddProduct(
    @Param('id') id: string,
    @Body() body: { productId: string; sortOrder?: number },
  ) {
    return this.collectionsService.adminAddProduct(id, body.productId, body.sortOrder ?? 0);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
  @ApiBearerAuth('access-token')
  @Delete('admin/:id/products/:productId')
  @ApiOperation({ summary: '[Admin] Remove product from collection' })
  adminRemoveProduct(
    @Param('id')        id:        string,
    @Param('productId') productId: string,
  ) {
    return this.collectionsService.adminRemoveProduct(id, productId);
  }
}
