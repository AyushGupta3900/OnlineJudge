FROM node:20-slim

WORKDIR /app

# Install compilers and GNU time
RUN apt-get update && apt-get install -y \
    g++ \
    openjdk-17-jdk \
    python3 \
    python3-pip \
    time \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5008

CMD ["node", "server.js"]
