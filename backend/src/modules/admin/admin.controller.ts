import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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
}
