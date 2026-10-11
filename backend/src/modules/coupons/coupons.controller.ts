import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List active coupons' })
  findAll() {
    return this.couponsService.findPublic();
  }

  @Public()
  @Post('validate')
  @ApiOperation({ summary: 'Validate coupon code against order amount' })
  validate(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validate(dto);
  }
}
