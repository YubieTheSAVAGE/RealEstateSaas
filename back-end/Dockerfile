FROM node:20-alpine

# Install PostgreSQL client for health checks
RUN apk add --no-cache postgresql-client curl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy Prisma schema before npm install to avoid postinstall issues
COPY prisma ./prisma

# Install dependencies (without postinstall script running)
RUN npm ci --ignore-scripts

# Generate Prisma client after dependencies are installed
RUN npx prisma generate

# Copy source code
COPY . .

# Make entrypoint script executable
RUN chmod +x scripts/docker-entrypoint.sh

# Create uploads directory
RUN mkdir -p src/uploads

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

EXPOSE 3001

# Use custom entrypoint for database migrations
ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
