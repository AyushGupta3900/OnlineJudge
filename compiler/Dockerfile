FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache \
    openjdk17 \
    python3 \
    py3-pip \
    g++ \
    make \
    bash \
    time

RUN npm install -g pm2

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5008

CMD ["pm2-runtime", "ecosystem.config.cjs"]
