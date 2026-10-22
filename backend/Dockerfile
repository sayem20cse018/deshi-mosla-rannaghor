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

# Run migrations then start (IF_NOT_EXISTS SQL is safe to re-run)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]