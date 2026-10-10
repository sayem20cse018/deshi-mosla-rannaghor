import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  findAll() {
    return this.deliveryService.findAll();
  }
}
