import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ── Create review (authenticated) ─────────────────────
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Submit a product review (must have purchased)' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(userId, dto);
  }

  // ── Get reviews for a product (public) ────────────────
  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Get approved reviews for a product' })
  @ApiQuery({ name: 'page',  required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort',  required: false, enum: ['latest', 'rating_high', 'rating_low'] })
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page')  page?:  number,
    @Query('limit') limit?: number,
    @Query('sort')  sort?:  string,
  ) {
    return this.reviewsService.getProductReviews(
      productId, page, limit, sort as any,
    );
  }

  // ── Can user review this product? ─────────────────────
  @Get('can-review/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Check if current user can review a product' })
  canReview(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.canReview(userId, productId);
  }

  // ── My reviews ─────────────────────────────────────────
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get my reviews' })
  myReviews(@CurrentUser('id') userId: string) {
    return this.reviewsService.getMyReviews(userId);
  }

  // ── Update own review ─────────────────────────────────
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update own review' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(userId, id, dto);
  }

  // ── Delete own review ─────────────────────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete own review' })
  remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.reviewsService.deleteReview(userId, id);
  }
}
