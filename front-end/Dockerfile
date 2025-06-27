FROM node:21.7.1-alpine

# Install additional packages for better font handling
RUN apk add --no-cache \
    curl \
    ca-certificates \
    && update-ca-certificates

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Set environment variables for better font loading
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

EXPOSE 3000

# Use a more robust startup command with better error handling
CMD ["sh", "-c", "npm run dev"]
