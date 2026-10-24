-- Collections, collection_products, product_variants
-- Using IF NOT EXISTS so this is idempotent even if a prior partial run created some tables

CREATE TABLE IF NOT EXISTS "collections" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "nameEn" VARCHAR(200),
    "slug" VARCHAR(220) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "banner" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" VARCHAR(200),
    "metaDesc" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "collection_products" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "collection_products_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "salePrice" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "weight" VARCHAR(50),
    "image" VARCHAR(500),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "collections_slug_key" ON "collections"("slug");
CREATE INDEX IF NOT EXISTS "collections_isActive_sortOrder_idx" ON "collections"("isActive", "sortOrder");

CREATE UNIQUE INDEX IF NOT EXISTS "collection_products_collectionId_productId_key" ON "collection_products"("collectionId", "productId");
CREATE INDEX IF NOT EXISTS "collection_products_collectionId_idx" ON "collection_products"("collectionId");
CREATE INDEX IF NOT EXISTS "collection_products_productId_idx" ON "collection_products"("productId");

CREATE UNIQUE INDEX IF NOT EXISTS "product_variants_sku_key" ON "product_variants"("sku");
CREATE INDEX IF NOT EXISTS "product_variants_productId_idx" ON "product_variants"("productId");

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'collection_products_collectionId_fkey'
  ) THEN
    ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collectionId_fkey"
      FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'collection_products_productId_fkey'
  ) THEN
    ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'product_variants_productId_fkey'
  ) THEN
    ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;