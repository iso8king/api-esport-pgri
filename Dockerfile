FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN mkdir -p /app/assets

EXPOSE 9999

CMD ["sh", "-c", "npx prisma db push --accept-data-loss --skip-generate && node src/app.js"]