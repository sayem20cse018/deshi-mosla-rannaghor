-- CreateTable: hero_slides
CREATE TABLE IF NOT EXISTS "hero_slides" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200),
    "titleEn" VARCHAR(200),
    "subtitle" VARCHAR(300),
    "subtitleEn" VARCHAR(300),
    "tag" VARCHAR(100),
    "tagEn" VARCHAR(100),
    "badge" VARCHAR(100),
    "badgeEn" VARCHAR(100),
    "image" VARCHAR(500),
    "imageMobile" VARCHAR(500),
    "ctaLabel" VARCHAR(100),
    "ctaLabelEn" VARCHAR(100),
    "ctaUrl" VARCHAR(300),
    "cta2Label" VARCHAR(100),
    "cta2LabelEn" VARCHAR(100),
    "cta2Url" VARCHAR(300),
    "bgColor" VARCHAR(200),
    "emoji" VARCHAR(10),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "hero_slides_isActive_sortOrder_idx" ON "hero_slides"("isActive", "sortOrder");

-- CreateTable: homepage_sections
CREATE TABLE IF NOT EXISTS "homepage_sections" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "title" VARCHAR(200),
    "titleEn" VARCHAR(200),
    "subtitle" VARCHAR(300),
    "subtitleEn" VARCHAR(300),
    "description" TEXT,
    "image" VARCHAR(500),
    "imageMobile" VARCHAR(500),
    "buttonLabel" VARCHAR(100),
    "buttonLabelEn" VARCHAR(100),
    "buttonUrl" VARCHAR(300),
    "extraData" JSONB,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "homepage_sections_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "homepage_sections_key_key" ON "homepage_sections"("key");
CREATE INDEX IF NOT EXISTS "homepage_sections_key_idx" ON "homepage_sections"("key");
CREATE INDEX IF NOT EXISTS "homepage_sections_isEnabled_sortOrder_idx" ON "homepage_sections"("isEnabled", "sortOrder");

-- CreateTable: media_files
CREATE TABLE IF NOT EXISTS "media_files" (
    "id" TEXT NOT NULL,
    "publicId" VARCHAR(300) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "secureUrl" VARCHAR(500) NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "altText" VARCHAR(255),
    "width" INTEGER,
    "height" INTEGER,
    "bytes" INTEGER,
    "format" VARCHAR(20),
    "folder" VARCHAR(100),
    "resourceType" VARCHAR(20) NOT NULL DEFAULT 'image',
    "uploadedBy" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "media_files_publicId_key" ON "media_files"("publicId");
CREATE INDEX IF NOT EXISTS "media_files_folder_idx" ON "media_files"("folder");
CREATE INDEX IF NOT EXISTS "media_files_createdAt_idx" ON "media_files"("createdAt");

-- CreateTable: product_variants
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "product_variants_sku_key" ON "product_variants"("sku");
CREATE INDEX IF NOT EXISTS "product_variants_productId_idx" ON "product_variants"("productId");
CREATE INDEX IF NOT EXISTS "product_variants_sku_idx" ON "product_variants"("sku");

-- CreateTable: collections
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "collections_slug_key" ON "collections"("slug");
CREATE INDEX IF NOT EXISTS "collections_slug_idx" ON "collections"("slug");
CREATE INDEX IF NOT EXISTS "collections_isActive_sortOrder_idx" ON "collections"("isActive", "sortOrder");

-- CreateTable: collection_products
CREATE TABLE IF NOT EXISTS "collection_products" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "collection_products_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "collection_products_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE CASCADE,
    CONSTRAINT "collection_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "collection_products_collectionId_productId_key" ON "collection_products"("collectionId", "productId");
CREATE INDEX IF NOT EXISTS "collection_products_collectionId_idx" ON "collection_products"("collectionId");
CREATE INDEX IF NOT EXISTS "collection_products_productId_idx" ON "collection_products"("productId");