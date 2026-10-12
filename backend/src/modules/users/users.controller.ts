import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users / Account')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ── Profile ───────────────────────────────────────────
  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update my profile' })
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Post('me/change-password')
  @ApiOperation({ summary: 'Change my password' })
  changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, dto);
  }

  // ── Orders ────────────────────────────────────────────
  @Get('me/orders')
  @ApiOperation({ summary: 'My order history' })
  getOrders(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.getMyOrders(userId, page, limit);
  }

  @Get('me/orders/:id')
  @ApiOperation({ summary: 'My order detail' })
  getOrderDetail(@CurrentUser('id') userId: string, @Param('id') orderId: string) {
    return this.usersService.getOrderDetail(userId, orderId);
  }

  // ── Addresses ─────────────────────────────────────────
  @Get('me/addresses')
  @ApiOperation({ summary: 'My saved addresses' })
  getAddresses(@CurrentUser('id') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Add new address' })
  createAddress(@CurrentUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.usersService.createAddress(userId, dto);
  }

  @Put('me/addresses/:id')
  @ApiOperation({ summary: 'Update address' })
  updateAddress(
    @CurrentUser('id') userId: string,
    @Param('id') addressId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(userId, addressId, dto);
  }

  @Delete('me/addresses/:id')
  @ApiOperation({ summary: 'Delete address' })
  deleteAddress(@CurrentUser('id') userId: string, @Param('id') addressId: string) {
    return this.usersService.deleteAddress(userId, addressId);
  }

  @Patch('me/addresses/:id/default')
  @ApiOperation({ summary: 'Set address as default' })
  setDefault(@CurrentUser('id') userId: string, @Param('id') addressId: string) {
    return this.usersService.setDefaultAddress(userId, addressId);
  }

  // ── Payment history ───────────────────────────────────
  @Get('me/payment-history')
  @ApiOperation({ summary: 'My payment history' })
  paymentHistory(@CurrentUser('id') userId: string) {
    return this.usersService.getPaymentHistory(userId);
  }

  // ── Reviews ───────────────────────────────────────────
  @Get('me/reviews')
  @ApiOperation({ summary: 'My reviews' })
  reviews(@CurrentUser('id') userId: string) {
    return this.usersService.getMyReviews(userId);
  }

  // ── Coupons used ──────────────────────────────────────
  @Get('me/coupons')
  @ApiOperation({ summary: 'My used coupons' })
  coupons(@CurrentUser('id') userId: string) {
    return this.usersService.getMyCoupons(userId);
  }

  // ── Notifications ─────────────────────────────────────
  @Get('me/notifications')
  @ApiOperation({ summary: 'My notifications' })
  notifications(
    @CurrentUser('id') userId: string,
    @Query('unread') unread?: string,
  ) {
    return this.usersService.getNotifications(userId, unread === 'true');
  }

  @Post('me/notifications/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markRead(@CurrentUser('id') userId: string) {
    return this.usersService.markNotificationsRead(userId);
  }
}
