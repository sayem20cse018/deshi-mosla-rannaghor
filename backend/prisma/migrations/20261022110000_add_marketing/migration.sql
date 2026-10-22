-- Newsletter, Offers, Promotions tables
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" VARCHAR(50),
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribedAt" TIMESTAMP(3),
    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");
CREATE INDEX IF NOT EXISTS "newsletter_subscribers_email_idx" ON "newsletter_subscribers"("email");
CREATE INDEX IF NOT EXISTS "newsletter_subscribers_isActive_idx" ON "newsletter_subscribers"("isActive");

CREATE TABLE IF NOT EXISTS "offers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "nameEn" VARCHAR(200),
    "description" TEXT,
    "image" VARCHAR(500),
    "discountType" VARCHAR(20) NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "minOrderAmount" DECIMAL(10,2),
    "maxDiscount" DECIMAL(10,2),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "targetType" VARCHAR(20) NOT NULL DEFAULT 'ALL',
    "targetIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "offers_isActive_idx" ON "offers"("isActive");

CREATE TABLE IF NOT EXISTS "promotions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "nameEn" VARCHAR(200),
    "description" TEXT,
    "discountType" VARCHAR(20) NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "targetType" VARCHAR(20) NOT NULL DEFAULT 'ALL',
    "targetIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "promotions_isActive_idx" ON "promotions"("isActive");