#!/bin/sh
set -e

echo "=== Resolving any failed migrations ==="
npx prisma migrate resolve --rolled-back 20261021121449_add_collections_variants || echo "Migration already resolved or not found, continuing..."

echo "=== Running migrations ==="
npx prisma migrate deploy

echo "=== Starting server ==="
node dist/src/main
