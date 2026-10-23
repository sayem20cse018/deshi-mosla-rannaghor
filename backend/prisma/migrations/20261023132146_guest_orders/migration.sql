-- Allow guest orders: make userId optional in addresses and orders
-- Prisma uses camelCase field names directly as PostgreSQL columns

ALTER TABLE "addresses" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL;