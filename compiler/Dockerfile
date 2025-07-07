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

# Install pm2 globally
RUN npm install -g pm2

# Copy dependencies and install
COPY package*.json ./
RUN npm install --production

# Copy app source
COPY . .

# Expose HTTP port
EXPOSE 5008

# Start HTTP server + 3 workers
CMD ["pm2-runtime", "ecosystem.config.js"]
