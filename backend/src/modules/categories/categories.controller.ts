import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public() @Get()
  @ApiOperation({ summary: 'Get all active categories (tree)' })
  findAll() { return this.categoriesService.findAll(); }

  @Public() @Get('flat')
  @ApiOperation({ summary: 'Get all categories flat list' })
  findFlat() { return this.categoriesService.findAllFlat(); }

  @Public() @Get(':slug')
  @ApiOperation({ summary: 'Get single category by slug' })
  findOne(@Param('slug') slug: string) { return this.categoriesService.findBySlug(slug); }
}
