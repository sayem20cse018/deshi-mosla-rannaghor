import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port         = configService.get<number>('PORT', 5000);
  const apiPrefix    = configService.get<string>('API_PREFIX', 'api/v1');
  const frontendUrl  = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  const corsOrigins  = configService.get<string>('CORS_ORIGINS', frontendUrl);
  const nodeEnv      = configService.get<string>('NODE_ENV', 'development');

  // Security headers -- relax for API use
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  app.use(compression());
  app.use(cookieParser());

  // CORS -- allow all configured origins
  const allowedOrigins = corsOrigins
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // In development allow localhost
      if (nodeEnv !== 'production' && origin.includes('localhost')) return callback(null, true);
      return callback(null, false);
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400,
  });

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Deshi Moslar Rannaghar API')
      .setDescription('Complete E-commerce REST API Documentation')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Products', 'Product management')
      .addTag('Categories', 'Category management')
      .addTag('Cart', 'Shopping cart')
      .addTag('Orders', 'Order management')
      .addTag('Payments', 'Payment processing')
      .addTag('Reviews', 'Product reviews')
      .addTag('Admin', 'Admin panel endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(apiPrefix + '/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log('Swagger docs: http://localhost:' + port + '/' + apiPrefix + '/docs');
  }

  await app.listen(port, '0.0.0.0');
  logger.log('Application running on port: ' + port);
  logger.log('Environment: ' + nodeEnv);
  logger.log('CORS allowed origins: ' + allowedOrigins.join(', '));
}

bootstrap();
