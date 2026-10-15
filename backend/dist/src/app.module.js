"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const products_module_1 = require("./modules/products/products.module");
const categories_module_1 = require("./modules/categories/categories.module");
const brands_module_1 = require("./modules/brands/brands.module");
const cart_module_1 = require("./modules/cart/cart.module");
const wishlist_module_1 = require("./modules/wishlist/wishlist.module");
const orders_module_1 = require("./modules/orders/orders.module");
const payments_module_1 = require("./modules/payments/payments.module");
const coupons_module_1 = require("./modules/coupons/coupons.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const recipes_module_1 = require("./modules/recipes/recipes.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const delivery_module_1 = require("./modules/delivery/delivery.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const banners_module_1 = require("./modules/banners/banners.module");
const admin_module_1 = require("./modules/admin/admin.module");
const reports_module_1 = require("./modules/reports/reports.module");
const settings_module_1 = require("./modules/settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            categories_module_1.CategoriesModule,
            brands_module_1.BrandsModule,
            cart_module_1.CartModule,
            wishlist_module_1.WishlistModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            coupons_module_1.CouponsModule,
            reviews_module_1.ReviewsModule,
            recipes_module_1.RecipesModule,
            inventory_module_1.InventoryModule,
            delivery_module_1.DeliveryModule,
            notifications_module_1.NotificationsModule,
            banners_module_1.BannersModule,
            admin_module_1.AdminModule,
            reports_module_1.ReportsModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map