import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@CurrentUser('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch('item/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, productId, dto.quantity);
  }

  @Delete('item/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@CurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear entire cart' })
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
