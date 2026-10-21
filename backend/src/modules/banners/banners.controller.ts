import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BannersService } from './banners.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get('hero-slides')
  getHeroSlides() {
    return this.bannersService.getHeroSlides();
  }

  @Public()
  @Get('homepage-sections')
  getHomepageSections() {
    return this.bannersService.getHomepageSections();
  }

  @Public()
  @Get('homepage-sections/:key')
  getHomepageSection(@Param('key') key: string) {
    return this.bannersService.getHomepageSection(key);
  }

  @Public()
  @Get()
  findAll() {
    return this.bannersService.findAll();
  }
}
