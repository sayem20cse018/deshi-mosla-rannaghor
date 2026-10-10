import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      name: 'দেশি মসলার রান্নাঘর API',
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV'),
      timestamp: new Date().toISOString(),
    };
  }
}
