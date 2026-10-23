-- Add avgRating to products table
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "avgRating" DOUBLE PRECISION DEFAULT 0;