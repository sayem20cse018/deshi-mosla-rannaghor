import {
  Controller, Get, Post, Body, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // ── List active coupons (public) ───────────────────────
  @Public()
  @Get()
  @ApiOperation({ summary: 'List active public coupons' })
  findAll() {
    return this.couponsService.findPublic();
  }

  // ── Validate (public — no user-limit check) ───────────
  @Public()
  @Post('validate')
  @ApiOperation({ summary: 'Validate coupon (guest)' })
  validate(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validate(dto);
  }

  // ── Validate (authenticated — checks user-limit) ───────
  @Post('validate/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Validate coupon with user-limit check (authenticated)' })
  validateForUser(
    @CurrentUser('id') userId: string,
    @Body() dto: ValidateCouponDto,
  ) {
    return this.couponsService.validateForUser(dto, userId);
  }

  // ── My used coupons ────────────────────────────────────
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'My used coupons' })
  myCoupons(@CurrentUser('id') userId: string) {
    return this.couponsService.getMyCoupons(userId);
  }
}
