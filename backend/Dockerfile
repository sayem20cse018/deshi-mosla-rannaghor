FROM node:20-slim AS builder

# Install OpenSSL (required by Prisma on Linux)
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (needed for nest build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source and build
COPY . .
RUN npm run build

# ── Production image ─────────────────────────────────────
FROM node:20-slim AS runner

RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy prisma for runtime generate + migrations
COPY prisma ./prisma/

# Copy scripts
COPY scripts ./scripts/
RUN sed -i 's/\r//' scripts/start.sh && chmod +x scripts/start.sh

# Copy built output from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["/bin/sh", "scripts/start.sh"]