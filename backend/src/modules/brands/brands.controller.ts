import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  findAll() {
    return this.brandsService.findAll();
  }
}
