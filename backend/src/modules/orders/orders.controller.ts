import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── Place order (COD) ────────────────────────────────
  @Post()
  @ApiOperation({ summary: 'Place a new COD order' })
  placeOrder(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.placeOrder(userId, dto);
  }

  // ── Get single order ──────────────────────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Get order detail by ID' })
  getOrder(@CurrentUser('id') userId: string, @Param('id') orderId: string) {
    return this.ordersService.getOrder(userId, orderId);
  }

  // ── Delivery charges (public) ─────────────────────────
  @Public()
  @Get('meta/delivery-charges')
  @ApiOperation({ summary: 'Get all delivery charges' })
  getDeliveryCharges() {
    return this.ordersService.getDeliveryCharges();
  }
}
