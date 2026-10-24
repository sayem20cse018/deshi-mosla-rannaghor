FROM node:20-slim

RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY scripts ./scripts/

RUN npm install --include=dev
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npm prune --production

# Make start script executable and ensure LF line endings
RUN chmod +x scripts/start.sh && sed -i 's/\r//' scripts/start.sh

EXPOSE 3000

CMD ["sh", "scripts/start.sh"]