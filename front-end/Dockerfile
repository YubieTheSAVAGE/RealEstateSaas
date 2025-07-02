FROM node:18-alpine

WORKDIR /app

# Install dependencies needed for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

COPY package*.json ./

# Clear npm cache and install with platform-specific flags
RUN npm cache clean --force
RUN npm install --force --platform=linux --arch=x64

COPY . .

# Build the application
# RUN npm run dev

EXPOSE 3000

CMD ["npm", "run", "dev"]