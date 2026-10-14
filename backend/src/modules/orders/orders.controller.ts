import {
  Controller, Post, Get, Patch, Body, Param,
  UseGuards, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

class CancelOrderDto {
  @ApiPropertyOptional({ example: 'ভুলে অর্ডার দিয়েছিলাম' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── Place order ───────────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Place a new order (COD or online)' })
  placeOrder(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.placeOrder(userId, dto);
  }

  // ── Track by order number (public — no auth needed) ───
  @Public()
  @Get('track/:orderNumber')
  @ApiOperation({ summary: 'Track order by order number (public)' })
  @ApiQuery({ name: 'phone', required: false, description: 'Phone for verification' })
  trackOrder(
    @Param('orderNumber') orderNumber: string,
    @Query('phone') phone?: string,
  ) {
    return this.ordersService.trackOrderByNumber(orderNumber, phone);
  }

  // ── Delivery charges (public) ─────────────────────────
  @Public()
  @Get('meta/delivery-charges')
  @ApiOperation({ summary: 'Get all delivery charges by area' })
  getDeliveryCharges() {
    return this.ordersService.getDeliveryCharges();
  }

  // ── Calculate delivery charge for a district ──────────
  @Public()
  @Get('meta/delivery-charge-calc')
  @ApiOperation({ summary: 'Calculate delivery charge for district + amount' })
  @ApiQuery({ name: 'district', required: true })
  @ApiQuery({ name: 'amount',   required: true, type: Number })
  calculateCharge(
    @Query('district') district: string,
    @Query('amount')   amount:   string,
  ) {
    return this.ordersService.calculateDeliveryCharge(district, Number(amount));
  }

  // ── Get single order (authenticated) ─────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get order detail by ID' })
  getOrder(@CurrentUser('id') userId: string, @Param('id') orderId: string) {
    return this.ordersService.getOrder(userId, orderId);
  }

  // ── Cancel order (customer) ───────────────────────────
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a PENDING order' })
  cancelOrder(
    @CurrentUser('id') userId: string,
    @Param('id') orderId: string,
    @Body() dto: CancelOrderDto,
  ) {
    return this.ordersService.cancelOrder(userId, orderId, dto.reason);
  }
}
