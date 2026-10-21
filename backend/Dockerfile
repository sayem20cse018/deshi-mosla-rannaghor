FROM node:20-slim

# Install OpenSSL - required by Prisma
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first (better Docker layer caching)
COPY package*.json ./
COPY prisma ./prisma/

# Install all deps including dev (needed for build)
RUN npm install --include=dev

# Generate Prisma client (needs OpenSSL, installed above)
RUN npx prisma generate

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build

# Remove dev dependencies for smaller image
RUN npm prune --production

EXPOSE 5000

# Start app directly - no prisma migrate (schema already exists in Neon)
CMD ["node", "dist/src/main"]