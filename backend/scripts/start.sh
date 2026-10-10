#!/bin/sh
set +e

echo "=== [1/3] Resolving any failed migrations ==="
npx prisma migrate resolve --rolled-back 20261021121449_add_collections_variants 2>&1 || true
npx prisma migrate resolve --rolled-back 20261021130000_add_media 2>&1 || true

echo "=== [2/3] Running prisma migrate deploy ==="
npx prisma migrate deploy
MIGRATE_EXIT=$?
echo "migrate deploy exit code: $MIGRATE_EXIT"

echo "=== [3/3] Starting NestJS ==="
exec node dist/src/main