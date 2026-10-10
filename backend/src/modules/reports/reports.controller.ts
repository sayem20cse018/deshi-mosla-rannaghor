import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN' as any, 'SUPER_ADMIN' as any)
@ApiBearerAuth('access-token')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  getSales(@Query('period') period?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.getSalesReport(period, from, to);
  }

  @Get('orders')
  getOrders(@Query('period') period?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.getOrdersReport(period, from, to);
  }

  @Get('products')
  getProducts(@Query('period') period?: string, @Query('limit') limit?: string) {
    return this.reportsService.getProductsReport(period, limit ? Number(limit) : 20);
  }

  @Get('customers')
  getCustomers(@Query('period') period?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.getCustomersReport(period, from, to);
  }

  @Get('inventory')
  getInventory() {
    return this.reportsService.getInventoryReport();
  }
}