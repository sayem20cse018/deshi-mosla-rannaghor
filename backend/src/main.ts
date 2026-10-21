import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
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

  // Railway injects PORT as process.env.PORT - must read it directly
  const port      = Number(process.env.PORT) || configService.get<number>('PORT', 5000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  const corsOrigins = configService.get<string>('CORS_ORIGINS', frontendUrl);
  const nodeEnv   = configService.get<string>('NODE_ENV', 'development');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(compression());
  app.use(cookieParser());

  const allowedOrigins = corsOrigins
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
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

  await app.listen(port, '0.0.0.0');
  logger.log('Application running on port: ' + port);
  logger.log('Environment: ' + nodeEnv);
  logger.log('CORS allowed origins: ' + allowedOrigins.join(', '));
}

bootstrap();