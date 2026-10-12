import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public() @Get()
  @ApiOperation({ summary: 'All active categories (tree)' })
  findAll() { return this.categoriesService.findAll(); }

  @Public() @Get('flat')
  @ApiOperation({ summary: 'All categories flat list (for filter sidebar)' })
  findFlat() { return this.categoriesService.findAllFlat(); }

  @Public() @Get('nav')
  @ApiOperation({ summary: 'Navigation bar categories (showInNav=true, ordered by navOrder)' })
  findForNav() { return this.categoriesService.findForNav(); }

  @Public() @Get(':slug')
  @ApiOperation({ summary: 'Single category by slug' })
  findOne(@Param('slug') slug: string) { return this.categoriesService.findBySlug(slug); }
}
