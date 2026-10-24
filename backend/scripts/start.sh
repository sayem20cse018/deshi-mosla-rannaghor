#!/bin/sh
echo '=== Step 1: Resolve failed migration (safe - idempotent) ==='
npx prisma migrate resolve --rolled-back 20261021121449_add_collections_variants
echo 'Step 1 done (exit ignored)'
echo ''
echo '=== Step 2: Deploy all pending migrations ==='
npx prisma migrate deploy
echo ''
echo '=== Step 3: Starting NestJS server ==='
exec node dist/src/main
