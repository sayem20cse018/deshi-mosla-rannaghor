FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/src/main"]