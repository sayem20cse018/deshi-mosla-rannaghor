import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BannersModule } from './modules/banners/banners.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    // Config — must be first
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core
    PrismaModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    PaymentsModule,
    CouponsModule,
    ReviewsModule,
    RecipesModule,
    InventoryModule,
    DeliveryModule,
    NotificationsModule,
    BannersModule,
    AdminModule,
    ReportsModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
