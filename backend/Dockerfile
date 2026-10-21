FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --include=dev
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/src/main"]