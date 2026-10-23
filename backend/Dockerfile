FROM node:20-slim

RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npm prune --production

EXPOSE 3000

# Resolve any failed migrations first, then deploy remaining, then start
CMD ["sh", "-c", "npx prisma migrate resolve --rolled-back 20261021121449_add_collections_variants; npx prisma migrate deploy && node dist/src/main"]
