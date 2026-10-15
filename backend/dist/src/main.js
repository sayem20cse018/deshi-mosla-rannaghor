"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
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
    const port = configService.get('PORT', 5000);
    const apiPrefix = configService.get('API_PREFIX', 'api/v1');
    const frontendUrl = configService.get('FRONTEND_URL', 'http://localhost:3000');
    const nodeEnv = configService.get('NODE_ENV', 'development');
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.enableCors({
        origin: frontendUrl.split(',').map((url) => url.trim()),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.setGlobalPrefix(apiPrefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    if (nodeEnv !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('দেশি মসলার রান্নাঘর API')
            .setDescription('Deshi Moslar Rannaghar — Complete E-commerce REST API Documentation')
            .setVersion('1.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
            .addTag('Auth', 'Authentication endpoints')
            .addTag('Products', 'Product management')
            .addTag('Categories', 'Category management')
            .addTag('Cart', 'Shopping cart')
            .addTag('Orders', 'Order management')
            .addTag('Payments', 'Payment processing')
            .addTag('Reviews', 'Product reviews')
            .addTag('Recipes', 'Recipe management')
            .addTag('Admin', 'Admin panel endpoints')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        logger.log(`Swagger docs: http://localhost:${port}/${apiPrefix}/docs`);
    }
    await app.listen(port);
    logger.log(`Application running on: http://localhost:${port}/${apiPrefix}`);
    logger.log(`Environment: ${nodeEnv}`);
}
bootstrap();
//# sourceMappingURL=main.js.map