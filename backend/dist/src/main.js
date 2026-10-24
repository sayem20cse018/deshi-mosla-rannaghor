"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });
    const configService = app.get(config_1.ConfigService);
    const port = Number(process.env.PORT) || configService.get('PORT', 5000);
    const apiPrefix = configService.get('API_PREFIX', 'api/v1');
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3000');
    const corsOrigins = configService.get('CORS_ORIGINS', frontendUrl);
    const nodeEnv = configService.get('NODE_ENV', 'development');
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    const allowedOrigins = corsOrigins
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin))
                return callback(null, true);
            if (nodeEnv !== 'production' && origin.includes('localhost'))
                return callback(null, true);
            return callback(null, false);
        },
        credentials: false,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        exposedHeaders: ['Authorization'],
        maxAge: 86400,
    });
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    await app.listen(port, '0.0.0.0');
    logger.log('Application running on port: ' + port);
    logger.log('Environment: ' + nodeEnv);
    logger.log('CORS allowed origins: ' + allowedOrigins.join(', '));
}
bootstrap();
//# sourceMappingURL=main.js.map