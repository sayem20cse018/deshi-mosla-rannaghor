import { Controller, Get, Post, Patch, Delete, Query, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/create-category.dto';
import { CreateBrandDto, UpdateBrandDto } from './dto/create-brand.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto/create-variant.dto';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ---------------------------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------------------------

  @Get('stats')
  @ApiQuery({ name: 'period', required: false, enum: ['today','yesterday','7days','30days','month','year','custom'] })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to',   required: false })
  getDashboardStats(
    @Query('period') period?: string,
    @Query('from')   from?:   string,
    @Query('to')     to?:     string,
  ) {
    return this.adminService.getDashboardStats(period ?? '30days', from, to);
  }

  @Get('sales-chart')
  @ApiQuery({ name: 'period', required: false })
  @ApiQuery({ name: 'from',   required: false })
  @ApiQuery({ name: 'to',     required: false })
  getSalesChart(
    @Query('period') period?: string,
    @Query('from')   from?:   string,
    @Query('to')     to?:     string,
  ) {
    return this.adminService.getSalesChart(period ?? '30days', from, to);
  }

  @Get('recent-orders')
  @ApiQuery({ name: 'limit', required: false })
  getRecentOrders(@Query('limit') limit?: string) {
    return this.adminService.getRecentOrders(limit ? Number(limit) : 10);
  }

  @Get('top-products')
  @ApiQuery({ name: 'period', required: false })
  @ApiQuery({ name: 'limit',  required: false })
  getTopProducts(
    @Query('period') period?: string,
    @Query('limit')  limit?:  string,
  ) {
    return this.adminService.getTopProducts(period ?? '30days', limit ? Number(limit) : 5);
  }

  @Get('recent-customers')
  @ApiQuery({ name: 'limit', required: false })
  getRecentCustomers(@Query('limit') limit?: string) {
    return this.adminService.getRecentCustomers(limit ? Number(limit) : 6);
  }

  @Get('recent-reviews')
  @ApiQuery({ name: 'limit', required: false })
  getRecentReviews(@Query('limit') limit?: string) {
    return this.adminService.getRecentReviews(limit ? Number(limit) : 5);
  }

  @Get('low-stock')
  @ApiQuery({ name: 'limit', required: false })
  getLowStockProducts(@Query('limit') limit?: string) {
    return this.adminService.getLowStockProducts(limit ? Number(limit) : 8);
  }

  // ---------------------------------------------------------------------------
  // ADMIN ORDER MANAGEMENT
  // ---------------------------------------------------------------------------

  @Get('orders')
  @ApiQuery({ name: 'page',          required: false })
  @ApiQuery({ name: 'limit',         required: false })
  @ApiQuery({ name: 'search',        required: false })
  @ApiQuery({ name: 'status',        required: false })
  @ApiQuery({ name: 'paymentStatus', required: false })
  @ApiQuery({ name: 'paymentMethod', required: false })
  @ApiQuery({ name: 'from',          required: false })
  @ApiQuery({ name: 'to',            required: false })
  @ApiQuery({ name: 'sortBy',        required: false })
  @ApiQuery({ name: 'sortOrder',     required: false })
  adminGetOrders(
    @Query('page')          page?:          string,
    @Query('limit')         limit?:         string,
    @Query('search')        search?:        string,
    @Query('status')        status?:        string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('from')          from?:          string,
    @Query('to')            to?:            string,
    @Query('sortBy')        sortBy?:        string,
    @Query('sortOrder')     sortOrder?:     string,
  ) {
    return this.adminService.adminGetOrders({
      page:    page    ? Number(page)    : 1,
      limit:   limit   ? Number(limit)   : 20,
      search,  status, paymentStatus, paymentMethod,
      from, to,
      sortBy:    sortBy    ?? 'createdAt',
      sortOrder: (sortOrder as 'asc' | 'desc') ?? 'desc',
    });
  }

  @Get('orders/status-counts')
  adminGetOrderStatusCounts() {
    return this.adminService.adminGetOrderStatusCounts();
  }

  @Get('orders/:id')
  adminGetOrder(@Param('id') id: string) {
    return this.adminService.adminGetOrder(id);
  }

  @Patch('orders/:id/status')
  adminUpdateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.adminService.adminUpdateOrderStatus(
      id, dto.status, dto.note, dto.courierName, dto.trackingNumber,
    );
  }

  @Post('orders/bulk-status')
  adminBulkUpdateStatus(@Body() body: { orderIds: string[]; status: string }) {
    return this.adminService.adminBulkUpdateStatus(body.orderIds, body.status);
  }

  // ---------------------------------------------------------------------------
  // ADMIN CATEGORIES
  // ---------------------------------------------------------------------------

  @Get('categories')
  @ApiQuery({ name: 'page',     required: false })
  @ApiQuery({ name: 'limit',    required: false })
  @ApiQuery({ name: 'search',   required: false })
  @ApiQuery({ name: 'parentId', required: false })
  adminGetCategories(
    @Query('page')     page?:     string,
    @Query('limit')    limit?:    string,
    @Query('search')   search?:   string,
    @Query('parentId') parentId?: string,
  ) {
    return this.adminService.adminGetCategories({
      page:  page  ? Number(page)  : 1,
      limit: limit ? Number(limit) : 50,
      search,
      parentId,
    });
  }

  @Get('categories/:id')
  adminGetCategory(@Param('id') id: string) {
    return this.adminService.adminGetCategory(id);
  }

  @Post('categories/reorder')
  adminReorderCategories(@Body() body: { items: Array<{ id: string; sortOrder: number }> }) {
    return this.adminService.adminReorderCategories(body.items);
  }

  @Post('categories')
  adminCreateCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.adminCreateCategory(dto);
  }

  @Patch('categories/:id')
  adminUpdateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.adminService.adminUpdateCategory(id, dto);
  }

  @Delete('categories/:id')
  adminDeleteCategory(@Param('id') id: string) {
    return this.adminService.adminDeleteCategory(id);
  }

  // ---------------------------------------------------------------------------
  // ADMIN BRANDS
  // ---------------------------------------------------------------------------

  @Get('brands')
  @ApiQuery({ name: 'page',   required: false })
  @ApiQuery({ name: 'limit',  required: false })
  @ApiQuery({ name: 'search', required: false })
  adminGetBrands(
    @Query('page')   page?:   string,
    @Query('limit')  limit?:  string,
    @Query('search') search?: string,
  ) {
    return this.adminService.adminGetBrands({
      page:  page  ? Number(page)  : 1,
      limit: limit ? Number(limit) : 50,
      search,
    });
  }

  @Get('brands/:id')
  adminGetBrand(@Param('id') id: string) {
    return this.adminService.adminGetBrand(id);
  }

  @Post('brands')
  adminCreateBrand(@Body() dto: CreateBrandDto) {
    return this.adminService.adminCreateBrand(dto);
  }

  @Patch('brands/:id')
  adminUpdateBrand(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.adminService.adminUpdateBrand(id, dto);
  }

  @Delete('brands/:id')
  adminDeleteBrand(@Param('id') id: string) {
    return this.adminService.adminDeleteBrand(id);
  }

  // ---------------------------------------------------------------------------
  // ADMIN PRODUCT VARIANTS
  // ---------------------------------------------------------------------------

  @Get('products/:id/variants')
  adminGetVariants(@Param('id') id: string) {
    return this.adminService.adminGetVariants(id);
  }

  @Post('products/:id/variants')
  adminCreateVariant(@Param('id') id: string, @Body() dto: CreateVariantDto) {
    return this.adminService.adminCreateVariant(id, dto);
  }

  @Patch('products/:productId/variants/:variantId')
  adminUpdateVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateVariantDto,
  ) {
    return this.adminService.adminUpdateVariant(productId, variantId, dto);
  }

  @Delete('products/:productId/variants/:variantId')
  adminDeleteVariant(
    @Param('productId') productId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.adminService.adminDeleteVariant(productId, variantId);
  }

  // â”€â”€ Homepage CMS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  @Get('homepage/slides')
  adminGetHeroSlides() {
    return this.adminService.adminGetHeroSlides();
  }

  @Post('homepage/slides')
  adminCreateHeroSlide(@Body() dto: Record<string, unknown>) {
    return this.adminService.adminCreateHeroSlide(dto as any);
  }

  @Patch('homepage/slides/reorder')
  adminReorderHeroSlides(@Body() body: { items: { id: string; sortOrder: number }[] }) {
    return this.adminService.adminReorderHeroSlides(body.items);
  }

  @Patch('homepage/slides/:id')
  adminUpdateHeroSlide(@Param('id') id: string, @Body() dto: Record<string, unknown>) {
    return this.adminService.adminUpdateHeroSlide(id, dto);
  }

  @Delete('homepage/slides/:id')
  adminDeleteHeroSlide(@Param('id') id: string) {
    return this.adminService.adminDeleteHeroSlide(id);
  }

  @Get('homepage/sections')
  adminGetHomepageSections() {
    return this.adminService.adminGetHomepageSections();
  }

  @Post('homepage/sections/reorder')
  adminReorderHomepageSections(@Body() body: { items: { key: string; sortOrder: number }[] }) {
    return this.adminService.adminReorderHomepageSections(body.items);
  }

  @Post('homepage/sections/:key/toggle')
  adminToggleHomepageSection(@Param('key') key: string, @Body() body: { isEnabled: boolean }) {
    return this.adminService.adminToggleHomepageSection(key, body.isEnabled);
  }

  @Post('homepage/sections/:key')
  adminUpsertHomepageSection(@Param('key') key: string, @Body() dto: Record<string, unknown>) {
    return this.adminService.adminUpsertHomepageSection(key, dto as any);
  }

  // â”€â”€ Testimonials CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  @Get('testimonials')
  adminGetTestimonials(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.adminGetTestimonials({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      search,
    });
  }

  @Post('testimonials')
  adminCreateTestimonial(@Body() dto: Record<string, unknown>) {
    return this.adminService.adminCreateTestimonial(dto as any);
  }

  @Patch('testimonials/:id')
  adminUpdateTestimonial(@Param('id') id: string, @Body() dto: Record<string, unknown>) {
    return this.adminService.adminUpdateTestimonial(id, dto);
  }

  @Delete('testimonials/:id')
  adminDeleteTestimonial(@Param('id') id: string) {
    return this.adminService.adminDeleteTestimonial(id);
  }


  // ── Coupon Admin ─────────────────────────────────────────
  @Get('coupons')
  adminGetCoupons(@Query('page') page?:string, @Query('limit') limit?:string, @Query('search') search?:string) {
    return this.adminService.adminGetCoupons({ page:page?Number(page):1, limit:limit?Number(limit):20, search });
  }
  @Get('coupons/:id/usages')
  adminGetCouponUsages(@Param('id') id:string) { return this.adminService.adminGetCouponUsages(id); }
  @Post('coupons')
  adminCreateCoupon(@Body() dto:Record<string,unknown>) { return this.adminService.adminCreateCoupon(dto as any); }
  @Patch('coupons/:id')
  adminUpdateCoupon(@Param('id') id:string, @Body() dto:Record<string,unknown>) { return this.adminService.adminUpdateCoupon(id, dto); }
  @Delete('coupons/:id')
  adminDeleteCoupon(@Param('id') id:string) { return this.adminService.adminDeleteCoupon(id); }

  // ── Banner Admin ─────────────────────────────────────────
  @Get('banners')
  adminGetBanners(@Query('page') page?:string, @Query('limit') limit?:string, @Query('position') position?:string) {
    return this.adminService.adminGetBanners({ page:page?Number(page):1, limit:limit?Number(limit):20, position });
  }
  @Post('banners')
  adminCreateBanner(@Body() dto:Record<string,unknown>) { return this.adminService.adminCreateBanner(dto as any); }
  @Patch('banners/:id')
  adminUpdateBanner(@Param('id') id:string, @Body() dto:Record<string,unknown>) { return this.adminService.adminUpdateBanner(id, dto); }
  @Delete('banners/:id')
  adminDeleteBanner(@Param('id') id:string) { return this.adminService.adminDeleteBanner(id); }

  // ── Offers Admin ─────────────────────────────────────────
  @Get('offers')
  adminGetOffers(@Query('page') page?:string, @Query('limit') limit?:string, @Query('search') search?:string) {
    return this.adminService.adminGetOffers({ page:page?Number(page):1, limit:limit?Number(limit):20, search });
  }
  @Post('offers')
  adminCreateOffer(@Body() dto:Record<string,unknown>) { return this.adminService.adminCreateOffer(dto); }
  @Patch('offers/:id')
  adminUpdateOffer(@Param('id') id:string, @Body() dto:Record<string,unknown>) { return this.adminService.adminUpdateOffer(id, dto); }
  @Delete('offers/:id')
  adminDeleteOffer(@Param('id') id:string) { return this.adminService.adminDeleteOffer(id); }

  // ── Promotions Admin ─────────────────────────────────────
  @Get('promotions')
  adminGetPromotions(@Query('page') page?:string, @Query('limit') limit?:string, @Query('search') search?:string) {
    return this.adminService.adminGetPromotions({ page:page?Number(page):1, limit:limit?Number(limit):20, search });
  }
  @Post('promotions')
  adminCreatePromotion(@Body() dto:Record<string,unknown>) { return this.adminService.adminCreatePromotion(dto); }
  @Patch('promotions/:id')
  adminUpdatePromotion(@Param('id') id:string, @Body() dto:Record<string,unknown>) { return this.adminService.adminUpdatePromotion(id, dto); }
  @Delete('promotions/:id')
  adminDeletePromotion(@Param('id') id:string) { return this.adminService.adminDeletePromotion(id); }

  // ── Newsletter Admin ──────────────────────────────────────
  @Get('newsletter/subscribers')
  adminGetSubscribers(@Query('page') page?:string, @Query('limit') limit?:string, @Query('search') search?:string) {
    return this.adminService.adminGetSubscribers({ page:page?Number(page):1, limit:limit?Number(limit):50, search });
  }
  @Get('newsletter/export')
  async adminExportSubscribers() {
    const csv = await this.adminService.adminExportSubscribers();
    return { success:true, data:csv };
  }
  @Delete('newsletter/subscribers/:id')
  adminDeleteSubscriber(@Param('id') id:string) { return this.adminService.adminDeleteSubscriber(id); }
  @Post('newsletter/subscribers/bulk-delete')
  adminBulkDeleteSubscribers(@Body() body:{ ids:string[] }) { return this.adminService.adminBulkDeleteSubscribers(body.ids); }
}