import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products with filters & pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  getFeatured() {
    return this.productsService.getFeatured();
  }

  @Public()
  @Get('best-sellers')
  @ApiOperation({ summary: 'Get best selling products' })
  getBestSellers() {
    return this.productsService.getBestSellers();
  }

  @Public()
  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get new arrival products' })
  getNewArrivals() {
    return this.productsService.getNewArrivals();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get single product by slug' })
  findOne(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }
}
