import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductSortBy {
  NEWEST       = 'newest',
  PRICE_ASC    = 'price_asc',
  PRICE_DESC   = 'price_desc',
  BEST_SELLING = 'best_selling',
  HIGHEST_RATED = 'highest_rated',
}

export class QueryProductDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1)
  page?: number = 1;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(100)
  limit?: number = 12;

  @ApiPropertyOptional() @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  category?: string; // slug

  @ApiPropertyOptional() @IsOptional() @IsString()
  brand?: string; // slug

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  minPrice?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(1) @Max(5)
  minRating?: number;

  @ApiPropertyOptional() @IsOptional() @IsString()
  stockStatus?: string; // IN_STOCK | LOW_STOCK | OUT_OF_STOCK

  @ApiPropertyOptional() @IsOptional() @Type(() => Boolean) @IsBoolean()
  hasDiscount?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsString()
  weight?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Boolean) @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional() @IsOptional() @Type(() => Boolean) @IsBoolean()
  isBestSeller?: boolean;

  @ApiPropertyOptional() @IsOptional() @Type(() => Boolean) @IsBoolean()
  isNewArrival?: boolean;

  @ApiPropertyOptional({ enum: ProductSortBy }) @IsOptional() @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy = ProductSortBy.NEWEST;

  @ApiPropertyOptional() @IsOptional() @IsString()
  tag?: string;
}
